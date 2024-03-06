import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { Session } from 'src/app/models/session.model';
import { Snippet } from 'src/app/models/snippet.model';
import { CloudService } from 'src/app/services/cloud.service';
import { PlayerService } from 'src/app/services/player.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-mixer',
  templateUrl: './mixer.component.html',
  styleUrls: ['./mixer.component.css']
})
export class MixerComponent implements AfterViewInit {

  ngAfterViewInit(): void {
    this.soundService.soundSourcesOnSub()
      .subscribe((soundSources: any) => {
        let flag = true;
        for (let sound of soundSources) {
          !sound.buffer ? flag = false : null;
        }
        if (flag) {
          for (let i = 0; i < soundSources.length; i++) {
            this.drawSound(i, 0, '');
          }
        }
      })
  }
  drawSound(soundIndex: number, offset: number, crop: string) {
    const sound = this.soundService.soundSources[soundIndex]
    let channelData = sound.buffer.getChannelData(0);
    const canvas = this.eleRef.nativeElement.querySelector(`#canvas${soundIndex}`);
    const canvasCtx = canvas.getContext('2d');
    canvasCtx.clearRect(0, 0, canvas.width, canvas.height);
    if (crop === 'start') {
      canvasCtx.fillStyle = 'rgb(185,185,185)';
      canvasCtx.fillRect(offset / 120 * 300,
        0,
        canvas.width - (offset / 120 * 300) - ((sound.buffer.duration - sound.endTime) / sound.buffer.duration * 300),
        canvas.height);
    } else if (crop === 'end') {
      canvasCtx.fillStyle = 'rgb(185,185,185)';
      canvasCtx.fillRect(sound.startTime / sound.buffer.duration * 300,
        0,
        (offset / 120 * 300) - (sound.startTime / sound.buffer.duration * 300),
        canvas.height);
    } else {
      canvasCtx.fillStyle = 'rgb(185,185,185)';
      canvasCtx.fillRect((sound.startTime / sound.buffer.duration * 300),
        0,
        canvas.width - (sound.startTime / sound.buffer.duration * 300) - ((sound.buffer.duration - sound.endTime) / sound.buffer.duration * 300),
        canvas.height);
    }
    canvasCtx.lineWidth = 2;
    canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

    canvasCtx.beginPath();

    const bufferLength = channelData.length;
    const sliceWidth = 300 * 1.0 / bufferLength;
    let x = 0;
    for (let i = 0; i < bufferLength; i++) {
      const v = channelData[i] * 75.0;
      const y = 150 / 2 + v;
      if (i === 0) {
        canvasCtx.moveTo(x, y);
      } else {
        canvasCtx.lineTo(x, y);
      }
      x += sliceWidth;
    }
    canvasCtx.stroke();
  }

  uploadingFile: any;
  mainMenu: boolean = true;
  presetPanel: boolean = false;

  progress: number = 0;

  soloSoundIndex: number = -1;

  changePitchHandler: any;

  startSet: boolean = false;
  endSet: boolean = false;

  constructor(private eleRef: ElementRef,
    public playerService: PlayerService,
    public soundService: SoundService,
    private cloudService: CloudService) { }

  changeName(soundIndex: number, event: any) {
    const name = event.target.value;
    this.soundService.soundSources[soundIndex].name = name;
    this.soundService.setMap();
  }
  @ViewChild('itemKey', { read: ElementRef }) itemKey: any;
  changeTriggerKey(soundIndex: number, event: any) {
    if (event.target.value !== ' ') {
      const newKey = event.target.value;
      const originalKey = this.soundService.soundSources[soundIndex].key;
      const soundTochange = this.soundService.soundSourcesKeyMap.get(newKey);
      if (soundTochange && soundTochange.key !== originalKey) {
        this.itemKey.nativeElement.value = originalKey;
      } else {
        this.soundService.soundSources[soundIndex].key = newKey;
        this.soundService.resetKeyMap(originalKey, newKey, this.soundService.soundSources[soundIndex]);
      }
    }
  }
  changeVolume(soundIndex: number, event: any) {
    const volume = event.target.value / 100;
    this.soundService.soundSources[soundIndex].volume = volume;
    this.soundService.setMap();
  }
  changePan(soundIndex: number, event: any) {
    const pan = event.target.value / 100;
    this.soundService.soundSources[soundIndex].pan = pan;
    this.soundService.setMap();
  }
  resetPan(soundIndex: number) {
    this.soundService.soundSources[soundIndex].pan = 0;
    this.soundService.setMap();
  }
  changeSwing(soundIndex: number, event: any) {
    const swing = event.target.value / 100;
    this.soundService.soundSources[soundIndex].swing = swing;
    this.soundService.setMap();
    console.log(this.soundService.soundSources[soundIndex].swing)
  }
  resetSwing(soundIndex: number) {
    this.soundService.soundSources[soundIndex].swing = 0;
    this.soundService.setMap();
  }
  changeFilterLow(soundIndex: number, event: any) {
    const filterLow = event.target.value;
    this.soundService.soundSources[soundIndex].highPassFrequency = filterLow;
    this.soundService.setMap();
  }
  changeFilterHigh(soundIndex: number, event: any) {
    const filterHigh = event.target.value;
    this.soundService.soundSources[soundIndex].lowPassFrequency = filterHigh;
    this.soundService.setMap();
  }
  changePitchClick(soundIndex: number, pitchIncreased: number) {
    this.soundService.soundSources[soundIndex].pitch += pitchIncreased;
    this.soundService.setMap();
  }
  changePitchHold(soundIndex: number, pitchIncreased: number) {
    if (pitchIncreased > 0) {
      this.changePitchHandler = setInterval(() => {
        if (this.soundService.soundSources[soundIndex].pitch < 4) {
          this.soundService.soundSources[soundIndex].pitch += pitchIncreased;
        } else {
          this.stopChangePitch()
        }
        this.soundService.setMap();
      }, 250)
    }
    if (pitchIncreased < 0) {
      this.changePitchHandler = setInterval(() => {
        if (this.soundService.soundSources[soundIndex].pitch > 0.125) {
          this.soundService.soundSources[soundIndex].pitch += pitchIncreased;
        } else {
          this.stopChangePitch()
        }
        this.soundService.setMap();
      }, 250)
    }
  }
  stopChangePitch() {
    if (this.changePitchHandler) {
      clearInterval(this.changePitchHandler);
    }
  }
  resetPitch(soundIndex: number) {
    this.soundService.soundSources[soundIndex].pitch = 1;
    this.soundService.setMap();
  }

  // clearSounds() {
  //   this.soundService.soundSources = [];
  //   this.soundService.soundSourcesKeyMap.clear();
  // }
  soloSound(soundIndex: number) {
    if (soundIndex === this.soloSoundIndex) {
      for (let sound of this.soundService.soundSources) {
        sound.isMuted = false;
      }
      this.soloSoundIndex = -1;
    } else {
      for (let sound of this.soundService.soundSources) {
        sound.isMuted = true;
      }
      this.soundService.soundSources[soundIndex].isMuted = false
      this.soloSoundIndex = soundIndex;
    }
  }
  toggleMute(soundIndex: number) {
    this.soundService.soundSources[soundIndex].isMuted = !this.soundService.soundSources[soundIndex].isMuted;
  }
  deleteSound(soundIndex: number) {
    const key = this.soundService.soundSources[soundIndex].key;
    this.cloudService.deleteSample(this.soundService.soundSources[soundIndex].fileName);
    this.soundService.deleteSound(soundIndex, key);
  }
  setStart() {
    this.endSet = false;
    this.startSet = !this.startSet;
  }
  setEnd() {
    this.startSet = false;
    this.endSet = !this.endSet;
  }
  resetCrop(soundIndex: number) {
    this.soundService.soundSources[soundIndex].startTime = 0;
    this.soundService.soundSources[soundIndex].endTime =
      this.soundService.soundSources[soundIndex].buffer.duration;
    this.drawSound(soundIndex, 0, '')
  }
  cropSound(soundIndex: number, event: any) {
    if (this.startSet) {
      const newStartTime = event.offsetX / 120 *
        this.soundService.soundSources[soundIndex].buffer.duration;
      if (newStartTime > this.soundService.soundSources[soundIndex].endTime) {
        // alert('Start Time Can\'t be greater than End Time')
      } else {
        this.drawSound(soundIndex, event.offsetX, 'start');
        this.soundService.soundSources[soundIndex].startTime = newStartTime;
      }
    } else if (this.endSet) {
      const newEndTime = event.offsetX / 120 *
        this.soundService.soundSources[soundIndex].buffer.duration;
      if (newEndTime < this.soundService.soundSources[soundIndex].startTime) {
        // alert('End Time Can\'t be less than Start Time')
      } else {
        this.drawSound(soundIndex, event.offsetX, 'end');
        this.soundService.soundSources[soundIndex].endTime = newEndTime;
      }
    } else {
      this.playerService.playSound(this.soundService.soundSources[soundIndex], -1)
    }
  }

  changeBPM(bpm: string) {
    if (+bpm >= 1000) {
      this.playerService.setBPM(999);
    } else if (+bpm <= 0) {
      this.playerService.setBPM(1);
    } else {
      this.playerService.setBPM(+bpm);
    }
  }
  changeLength(event: any) {
    this.playerService.setSections(+event)
    this.soundService.soundSources.forEach((source: Snippet) => {
      source.playable = [...new Array<boolean>(this.playerService.length).fill(false)]
    })
  }
  reset() {
    this.soundService.soundSources.forEach((source: Snippet) => {
      source.playable = [...new Array<boolean>(this.playerService.length).fill(false)]
    });
  }
  clickPlay(soundIndex: number, event: any) {
    event.preventDefault()
    if (event.target.nodeName === 'DIV') {
      this.playerService.playSound(this.soundService.soundSources[soundIndex], -1)
    }
  }
  getFile(event: any) {
    this.uploadingFile = event.target.files[0];
    this.playerService.isUploading = true;
    this.mainMenu = false;
  }
  cancelUpload() {
    this.uploadingFile = undefined;
    this.playerService.isUploading = false;
    this.mainMenu = true;
  }
  uploadSample(fileName: string, triggerKey: string) {
    const uploadSample = this.uploadingFile;
    const fileNameValid: boolean = fileName !== '' && !/[^a-z0-9_.@()-]/i.test(fileName);
    const triggerKeyValid: boolean = !this.soundService.soundSourcesKeyMap.has(triggerKey);
    if (!fileNameValid) {
      alert('Wrong filename format')
    } else if (!triggerKeyValid) {
      alert('Trigger has been used')
    } else if (triggerKey === ' ') {
      alert('Trigger can\'t be space')
    } else {
      this.cloudService.uploadSample(uploadSample, fileName, triggerKey);
      this.cloudService.progressAsObservable()
        .subscribe((progress: number) => {
          this.progress = progress
          if (this.progress == 100) {
            setTimeout(() => {
              this.uploadingFile = undefined;
              this.playerService.isUploading = false;
              this.mainMenu = true;
            }, 500);
            setTimeout(() => {
              this.cloudService.progress.next(0);
            }, 600);
          }
        })
    }
  }
  openPresets() {
    this.mainMenu = false;
    this.presetPanel = true;
  }
  loadPreset(preset: string) {
    this.soundService.loadPresets(preset);
    this.closePresets();
  }
  loadWorking() {
    this.soundService.getWorkingSounds()
    this.closePresets();
  }
  closePresets() {
    this.mainMenu = true;
    this.presetPanel = false;
  }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    if (!this.uploadingFile && this.soundService.soundSourcesKeyMap.has(event.key)) {
      let sound = this.soundService.soundSourcesKeyMap.get(event.key)
      if (sound) {
        this.playerService.playSound(sound, -1);
      }
    }
  }
}
