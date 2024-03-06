import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PlayerService } from 'src/app/services/player.service';
import { SoundService } from 'src/app/services/sound.service';

@Component({
  selector: 'app-drumPanel',
  templateUrl: './drumPanel.component.html',
  styleUrls: ['./drumPanel.component.css']
})
export class DrumPanelComponent implements OnInit {

  isLeftMouseDown: boolean = false;
  isRightMouseDown: boolean = false;

  interval: any;
  intervalTime: number = 0;
  playingIndex: number = -1;

  @ViewChild('panelContainer', { read: ElementRef }) container: any;
  constructor(public soundService: SoundService,
    public playerService: PlayerService) { }

  ngOnInit(): void {
    this.playerService.isPlayingObserver()
      .subscribe((isPlaying: boolean) => {
        if (isPlaying) {
          this.play();
        } else {
          this.stop();
        }
      })
  }

  scrollHandler(event: any) {
    this.container.nativeElement.scrollLeft += event.deltaY
  }

  play() {
    this.playerService.intervalObserver()
      .subscribe((intervalTime: number) => {
        if (this.playerService.isPlaying) {
          this.intervalTime = intervalTime;
          clearInterval(this.interval);
          this.playingIndex = -1;
          this.interval = setInterval(() => {
            this.playingIndex >= this.playerService.length - 1 ? this.playingIndex = 0 : this.playingIndex++;
            for (let sound of this.soundService.soundSources) {
              if (sound.playable[this.playingIndex]) {
                this.playerService.playSound(sound, this.playingIndex)
              }
            }
          }, this.intervalTime)
        }
      })

  }
  stop() {
    this.playingIndex = -1;
    clearInterval(this.interval);
  }

  fillSteps(soundIndex: number, event: any) {
    const steps = event.target.value;
    console.log(steps)
    if (steps === 0 || steps == -1) {
      this.clearRow(soundIndex)
    } else {
      this.clearRow(soundIndex)
      for (let i = 0; i < this.soundService.soundSources[soundIndex].playable.length; i++) {
        if (i % steps === 0) {
          this.soundService.soundSources[soundIndex].playable[i] = true;
        }
      }
    }
  }

  clearRow(soundIndex: number) {
    this.soundService.soundSources[soundIndex].playable.fill(false)
  }

  rightClickPreventDefault(event: any) {
    event.preventDefault();
  }
  setPlayable(soundIndex: number, snippetIndex: number, event: any) {
    if (event.which === 1) {
      this.soundService.soundSources[soundIndex].playable[snippetIndex] = !this.soundService.soundSources[soundIndex].playable[snippetIndex];
    } else if (event.which === 3) {
      this.soundService.soundSources[soundIndex].playable[snippetIndex] = false
    }
  }
  toggle(soundIndex: number, snippetIndex: number) {
    if (this.isLeftMouseDown) {
      this.soundService.soundSources[soundIndex].playable[snippetIndex] = true;
    }
    if (this.isRightMouseDown) {
      this.soundService.soundSources[soundIndex].playable[snippetIndex] = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    if (event.key === ' ' && !this.playerService.isUploading) {
      event.preventDefault();
      this.playerService.play();
    }
  }
  @HostListener('window:mousedown', ['$event'])
  onLeftMouseDown(event: any) {
    if (event.which === 1)
      this.isLeftMouseDown = true;
    if (event.which === 3)
      this.isRightMouseDown = true;
  }
  @HostListener('window:mouseup', ['$event'])
  onLeftMouseUp(event: any) {
    if (event.which === 1)
      this.isLeftMouseDown = false;
    if (event.which === 3)
      this.isRightMouseDown = false;
  }
}
