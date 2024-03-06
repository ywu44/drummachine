import { Injectable } from '@angular/core';
import { PlayerService } from './player.service';
import { Session } from '../models/session.model';
import { SoundService } from './sound.service';
import { Snippet } from '../models/snippet.model';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(private playerService: PlayerService, private soundService: SoundService) {
  }
  workingSession: Session = {
    name: '',
    type: 'working',
    bpm: 0,
    length: 0,
    snippets: []
  };
}
