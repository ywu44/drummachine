import { TestBed } from '@angular/core/testing';

import { PlayerService } from './player.service';

describe('PlayerService', () => {
  let service: PlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should be play when play() run', () => {
    service.play();
    expect(service.isPlaying).toBeTrue;
  })
  it('should change BPM', () => {
    service.setBPM(155);
    expect(service.bpm).toEqual(155);
  })
});
