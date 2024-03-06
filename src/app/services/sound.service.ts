import { Injectable } from '@angular/core';
import { Snippet } from '../models/snippet.model';
import { PlayerService } from './player.service';
import { presets } from '../presetsSeeds/presets'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoundService {
  soundSources: Snippet[] = [];
  soundSourcesSubject: Subject<Snippet[]> = new Subject();
  soundSourcesOnSub() {
    return this.soundSourcesSubject.asObservable();
  }
  workingSoundSources: Snippet[] = [];

  soundSourcesKeyMap: Map<string, Snippet> = new Map();
  constructor(private playerService: PlayerService) {
  }
  setWorkingSounds(workingFiles: any): void {
    let tempTriggerIndex = 0;
    const tempTriggers = 'qwertyuiopasdfghjklzxcvbnm'.split('')
    workingFiles.forEach((file: any) => {
      const temp: Snippet = {
        name: file.objectKey.replaceAll('working/','').replaceAll('.wav',''),
        fileName: file.objectKey.replaceAll('working/',''),
        src: file.signedUrl,
        volume: 1,
        pan: 0,
        lowPassFrequency: 22050,
        highPassFrequency: 0,
        pitch: 1,
        isMuted: false,
        playable: new Array<boolean>(32).fill(false),
        buffer: '',
        key: `${tempTriggers[tempTriggerIndex]}`,
        startTime: 0,
        endTime: 0,
        swing: 0
      }
      tempTriggerIndex++
      this.workingSoundSources.push(temp)
    });
  }
  getWorkingSounds(): void {
    this.soundSources = [...this.workingSoundSources]
    this.playerService.length = this.soundSources[0].playable.length;
    for (let sound of this.soundSources) {
      this.loadAudio(sound);
    }
    this.soundSourcesKeyMap.clear();
    this.setMap();
  }

  loadAudio(sound: Snippet): void {
    let request = new XMLHttpRequest();
    request.open('GET', sound.src, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
      try {
        this.playerService.audioContext.decodeAudioData(request.response, (buffer: any) => {
          sound.buffer = buffer;
          if (!sound.endTime) sound.endTime = buffer.duration;
          this.soundSourcesSubject.next(this.soundSources);
        });
      } catch(error) {
        console.log(error)
      }
    };
    request.send();
  }
  setMap(): void {
    for (let source of this.soundSources) {
      this.soundSourcesKeyMap.set(source.key, source);
    }
  }
  resetKeyMap(key: string, newKey: string, snippet: Snippet) {
    this.soundSourcesKeyMap.delete(key);
    this.soundSourcesKeyMap.set(newKey, snippet)
  }

  addSound(newSound: Snippet) {
    // console.log(this.soundSources)
    // console.log(this.soundSourcesKeyMap)
    // console.log(newSound)
    this.soundSources.push(newSound);
    this.soundSourcesKeyMap.set(newSound.key, newSound)
    this.loadAudio(newSound);
    // console.log(this.soundSources)
    // console.log(this.soundSourcesKeyMap)
  }
  deleteSound(soundIndex: number, triggerKey: string) {
    this.soundSources.splice(soundIndex, 1);
    this.soundSourcesKeyMap.delete(triggerKey);
    // console.log(this.soundSources)
    // console.log(this.soundSourcesKeyMap)
  }
  getPresets() {
    return presets;
  }
  loadPresets(preset: string) {
    this.playerService.setBPM(presets.get(preset)!.bpm);
    this.playerService.setSections(length = presets.get(preset)!.length)
    this.soundSources = []
    for (let sound of presets.get(preset)!.snippets) {
      const temp = { ...sound }
      temp.playable = [...sound.playable]
      this.soundSources.push(temp)
    }
    for (let sound of this.soundSources) {
      this.loadAudio(sound);
    }
    this.soundSourcesKeyMap.clear();
    this.setMap();
  }
}
