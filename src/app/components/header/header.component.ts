import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Snippet } from 'src/app/models/snippet.model';
import { CloudService } from 'src/app/services/cloud.service';
import { PlayerService } from 'src/app/services/player.service';
import { SoundService } from 'src/app/services/sound.service';
import { soundValidator } from './sound.validator';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  constructor(public playerService: PlayerService,
    public soundService: SoundService,
    private cloudService: CloudService,
    private fb: FormBuilder,
    private soundValidator: soundValidator) { }

  uploadingFile: any;
  mainMenu: boolean = true;
  presetPanel: boolean = false;

  progress: number = 0;


  newSoundForm: FormGroup = this.fb.group({
    fileName: ['', [Validators.required, this.soundValidator.soundFileNameValidator()]],
    trigger: ['', [Validators.required, this.soundValidator.soundTriggerValidator()]]
  })
  get fileName(): AbstractControl | null {
    return this.newSoundForm.get('fileName')
  }
  get trigger(): AbstractControl | null {
    return this.newSoundForm.get('trigger')
  }

  changeBPM(bpm: string) {
    let bpmValue = +bpm;
    if (bpmValue >= 1000) {
      bpmValue = 999;
    } else if (+bpm <= 0) {
      bpmValue = 1
    }
    this.playerService.setBPM(bpmValue);
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
  uploadSample() {
    const uploadSample = this.uploadingFile;
    const { fileName, trigger } = this.newSoundForm.controls;
    if (fileName.valid && trigger.valid) {
      const { fileName, trigger } = this.newSoundForm.getRawValue()
      this.cloudService.uploadSample(uploadSample, fileName, trigger);
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
    } else {
      alert('not valid')
    }
    this.newSoundForm.reset({
      fileName: '',
      trigger: ''
    })
    // const fileNameValid: boolean = fileName !== '' && !/[^a-z0-9_.@()-]/i.test(fileName);
    // const triggerKeyValid: boolean = !this.soundService.soundSourcesKeyMap.has(triggerKey);
    // if (!fileNameValid) {
    //   alert('Wrong filename format')
    // } else if (!triggerKeyValid) {
    //   alert('Trigger has been used')
    // } else if (triggerKey === ' ') {
    //   alert('Trigger can\'t be space')
    // } else {
    //   this.cloudService.uploadSample(uploadSample, fileName, triggerKey);
    //   this.cloudService.progressAsObservable()
    //     .subscribe((progress: number) => {
    //       this.progress = progress
    //       if (this.progress == 100) {
    //         setTimeout(() => {
    //           this.uploadingFile = undefined;
    //           this.playerService.isUploading = false;
    //           this.mainMenu = true;
    //         }, 500);
    //         setTimeout(() => {
    //           this.cloudService.progress.next(0);
    //         }, 600);
    //       }
    //     })
    // }
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
}
