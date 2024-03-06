import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Snippet } from '../models/snippet.model';

@Directive({
  selector: '[appKeyPress]'
})
export class KeyPressDirective {
  @Input() sourcesKeyMap: Map<string, Snippet> = new Map();

  constructor(private eleRef: ElementRef) { }
  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: any) {
    const keyButton = this.eleRef.nativeElement;
    if (this.sourcesKeyMap.has(event.key) && keyButton.id === `itemKey${event.key}`) {
      keyButton.style.backgroundColor = 'rgb(75, 75, 75)'
    }
  }
  @HostListener('window:keyup', ['$event'])
  onKeyUp(event: any) {
    const keyButton = this.eleRef.nativeElement;
    if (this.sourcesKeyMap.has(event.key) && keyButton.id === `itemKey${event.key}`) {
      keyButton.style.backgroundColor = 'rgb(230, 230, 230)'
    }
  }
  @HostListener('window:mousedown', ['$event'])
  onMouseDown(event: any) {
    const keyButton = this.eleRef.nativeElement;
    if ( keyButton.id === event.srcElement.id) {
      keyButton.style.backgroundColor = 'rgb(75, 75, 75)'
    }
  }
  @HostListener('window:mouseup', ['$event'])
  onMouseUp(event: any) {
    const keyButton = this.eleRef.nativeElement;
    if ( keyButton.id === event.srcElement.id) {
      keyButton.style.backgroundColor = 'rgb(230, 230, 230)'
    }
  }
}
