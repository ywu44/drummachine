import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, filter } from 'rxjs';
import { Snippet } from '../models/snippet.model';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {
  bpm: number = 135;
  length: number = 16;

  isUploading: boolean = false;

  isPlaying: boolean = false;
  intervalTime: number = +(60000 / this.bpm).toFixed(5) / 4;

  isPlayingSubject: Subject<any> = new Subject();
  isPlayingObserver(): Observable<boolean> {
    return this.isPlayingSubject.asObservable();
  }
  intervalSubject: BehaviorSubject<number> = new BehaviorSubject<number>(this.intervalTime);
  intervalObserver(): Observable<number> {
    return this.intervalSubject.asObservable();
  }

  audioContext: AudioContext = new AudioContext();

  constructor() { }
  setBPM(bpm: number): void {
    this.bpm = bpm;
    this.intervalTime = +(60000 / this.bpm).toFixed(3) / 4;
    this.intervalSubject.next(this.intervalTime);
  }
  setSections(length: number): void {
    this.length = length;
  }
  play() {
    this.isPlaying = !this.isPlaying;
    this.isPlayingSubject.next(this.isPlaying);
  }
  playSound(sound: Snippet, soundIndex: number) {
    let audioSource = this.audioContext.createBufferSource();
    if (sound.buffer)
      audioSource.buffer = sound.buffer;
    const gainNode = this.audioContext.createGain()
    const pannerNode = this.audioContext.createStereoPanner();

    const highPassFilter = this.audioContext.createBiquadFilter();
    highPassFilter.type = 'highpass';
    highPassFilter.frequency.value = sound.highPassFrequency;
    highPassFilter.Q.value = 1;
    highPassFilter.gain.value = 0;

    const lowPassFilter = this.audioContext.createBiquadFilter();
    lowPassFilter.type = 'lowpass';
    lowPassFilter.frequency.value = sound.lowPassFrequency;
    lowPassFilter.Q.value = 1;
    lowPassFilter.gain.value = 0;

    const delayNode = this.audioContext.createDelay();
    if (soundIndex === -1) {
      delayNode.delayTime.value = 0
    } else {
      if (soundIndex % 2 !== 0) {
        delayNode.delayTime.value = sound.swing;
      } else {
        delayNode.delayTime.value = 0;
      }
    }

    const analyser = this.audioContext.createAnalyser();
    analyser.fftSize = 2048;

    // connect the node route
    audioSource.connect(lowPassFilter);
    lowPassFilter.connect(highPassFilter);
    highPassFilter.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(delayNode);
    delayNode.connect(analyser)
    analyser.connect(this.audioContext.destination)


    // play the sound
    sound.isMuted ? gainNode.gain.value = 0 :
      gainNode.gain.value = sound.volume;
    audioSource.playbackRate.value = sound.pitch;
    pannerNode.pan.value = sound.pan;
    audioSource.start(0, sound.startTime, sound.endTime - sound.startTime);
  }
}
