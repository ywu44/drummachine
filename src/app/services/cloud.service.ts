import { HttpClient, HttpEventType, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SoundService } from './sound.service';
import { Snippet } from '../models/snippet.model';
import { PlayerService } from './player.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CloudService {

  private workingFilesAPI: string = 'https://p9ibj7ty8h.execute-api.us-east-1.amazonaws.com/default/getWorkingFiles'

  private uploadAPI: string = 'https://p9ibj7ty8h.execute-api.us-east-1.amazonaws.com/default/uploadSample';
  private deleteAPI: string = 'https://us-central1-premium-carving-377914.cloudfunctions.net/dmServer/delete';
  progress: Subject<number> = new Subject();;
  progressAsObservable() {
    return this.progress.asObservable()
  }
  constructor(private http: HttpClient, private soundService: SoundService, private playerService: PlayerService) { }

  getWorkingSamples() {
    this.http.get(this.workingFilesAPI)
      .subscribe((res: any) => {
        this.soundService.setWorkingSounds(res.slice(1, res.length));
        this.soundService.getWorkingSounds()
      })
  }
  uploadSample(sampleFile: File, sampleName: string, triggerKey: string) {
    let data: FormData = new FormData();
    data.set('file', sampleFile, sampleFile.name);
    const headers = new HttpHeaders({
      'Access-Control-Allow-Origin': '*'
    });
    this.http.post(`${this.uploadAPI}?filename=${sampleName}`, data, {
      headers: headers,
      reportProgress: true,
      observe: "events"
    })
      .subscribe({
        next: (res: any) => {
          if (res.type === HttpEventType.UploadProgress) {
            this.progress.next(Math.round(100 * res.loaded / res.total));
          } else {
            if (res.body && res.body.message === 'Uploaded') {
              const newSound: Snippet = {
                name: sampleName,
                fileName: res.body.fileName,
                volume: 1,
                pan: 0,
                highPassFrequency: 0,
                lowPassFrequency: 22050,
                pitch: 1,
                isMuted: false,
                src: res.body.url,
                playable: new Array<boolean>(this.playerService.length).fill(false),
                buffer: '',
                key: triggerKey,
                startTime: 0,
                endTime: 0,
                swing: 0
              }
              this.soundService.addSound(newSound);
            }
          }
        },
        error: (err) => console.log(err)
      });
  }
  deleteSample(sampleName: string) {
    this.http.post(`${this.deleteAPI}?filename=${sampleName}`, {
      reportProgress: true, observe: "events"
    })
      .subscribe({
        next: (res: any) => {
          console.log(res)
        },
        error: (err) => console.log(err)
      });
  }
}
