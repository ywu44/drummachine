import { Component, OnInit } from '@angular/core';
import { CloudService } from './services/cloud.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'drumMachine';
  constructor(private cloudService: CloudService) {}
  ngOnInit(): void {
    this.cloudService.getWorkingSamples();
  }
}
