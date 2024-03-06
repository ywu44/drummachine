import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PanelComponent } from './panel.component';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DrumPanelComponent } from 'src/app/components/drumPanel/drumPanel.component';
import { MixerComponent } from 'src/app/components/mixer/mixer.component';
import { FormsModule } from '@angular/forms';
import { StepDirective } from 'src/app/directives/step.directive';

describe('PanelComponent', () => {
  let component: PanelComponent;
  let fixture: ComponentFixture<PanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule],
      declarations: [PanelComponent, HeaderComponent, DrumPanelComponent, MixerComponent, StepDirective],
    })
      .compileComponents();

    fixture = TestBed.createComponent(PanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
