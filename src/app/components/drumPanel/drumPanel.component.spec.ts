import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrumPanelComponent } from './drumPanel.component';
import { PlayerService } from 'src/app/services/player.service';
import { FormsModule } from '@angular/forms';
import { SoundService } from 'src/app/services/sound.service';
import { StepDirective } from 'src/app/directives/step.directive';

describe('DrumPanelComponent', () => {
  let component: DrumPanelComponent;
  let fixture: ComponentFixture<DrumPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [ DrumPanelComponent, StepDirective ],
      providers: [PlayerService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DrumPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
