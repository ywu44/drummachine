import { AfterViewInit, Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { PlayerService } from '../services/player.service';

@Directive({
  selector: '[appStep]'
})
export class StepDirective implements AfterViewInit, OnChanges {
  @Input() isPlaying: boolean = false;
  @Input() length: number = 32;
  buttons: any;
  interval: any;
  intervalTime: number = 0;
  playingIndex: number = -1;

  constructor(private eleRef: ElementRef, private playerService: PlayerService) { }
  ngAfterViewInit(): void {
    this.buttons = this.eleRef.nativeElement.querySelectorAll('.indicator')
  }
  ngOnChanges(): void {
    this.buttons = this.eleRef.nativeElement.querySelectorAll('.indicator')
    if (this.isPlaying) {
      this.playerService.intervalObserver()
        .subscribe((intervalTime: number) => {
          if (this.playerService.isPlaying) {
            this.intervalTime = intervalTime;
            if (this.playingIndex !== -1) {
              this.buttons[this.playingIndex].classList.remove('playing')
            }
            clearInterval(this.interval);
            this.playingIndex = -1;
            this.interval = setInterval(() => {
              this.playingIndex >= this.playerService.length - 1 ? this.playingIndex = 0 : this.playingIndex++;
              if (this.playingIndex === 0) {
                this.buttons[this.playerService.length - 1].classList.remove('playing')
              } else {
                this.buttons[this.playingIndex - 1].classList.remove('playing')
              }
              this.buttons[this.playingIndex].classList.add('playing')
            }, this.playerService.intervalTime);
          }
        })

    } else {
      if (this.playingIndex !== -1) {
        this.buttons[this.playingIndex].classList.remove('playing')
      }
      clearInterval(this.interval)
    }
  }

}
