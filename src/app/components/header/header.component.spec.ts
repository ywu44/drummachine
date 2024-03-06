import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { HeaderComponent } from './header.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { PlayerService } from 'src/app/services/player.service';


describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let playerService: PlayerService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, FormsModule],
      declarations: [ HeaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    playerService = TestBed.inject(PlayerService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('BPM should be 135 when started', () => {
    let element = fixture.debugElement.query(By.css('#bpm')).nativeElement;
    expect(element.value).toEqual('135')
  });
  it('When enter the new bpm, the bpm of playerService is changed', fakeAsync(() =>{
    let element = fixture.debugElement.query(By.css('#bpm')).nativeElement;
    expect(element.value).toEqual('135')
    element.value = 155;
    expect(element.value).toEqual('155')
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    expect(component.playerService.bpm).toEqual(155)


    spyOn(component, 'changeBPM');
    spyOn(playerService, 'setBPM').and.returnValue
    element.value = 1555;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    expect(component.changeBPM).toHaveBeenCalled();
    expect(component.playerService.bpm).toEqual(999)
    
    element.value = -100;
    element.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    tick();
    expect(component.changeBPM).toHaveBeenCalled();
    expect(component.playerService.bpm).toEqual(1)
  }))
  it('when select bars in dropdown, it should change the sections', () => {
    const select = fixture.debugElement.nativeElement.querySelector('#bars');
    select.value = select.options[1].value;
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(component.playerService.length).toEqual(32);
  })
  it('Bars should be 8 when started', () => {
    let element = fixture.debugElement.query(By.css('#bars')).nativeElement;
    expect(element.value).toEqual('16') // because it equals to 2 * 8
  });
  it('When clicked preset, preset pandel should be shown', fakeAsync(() => {
    spyOn(component, 'openPresets');
    let button = fixture.debugElement.nativeElement.querySelector('#presetButton');
    button.click();
    tick(1000);
    expect(component.openPresets).toHaveBeenCalled();
    expect(component.mainMenu).toBeFalse();
    expect(component.presetPanel).toBeTrue();
  }))
  it('When click play, isPlaying should be true, vice versa', fakeAsync(() => {
    let playButton = fixture.debugElement.query(By.css('.playButton')).nativeElement;
    playButton.click();
    expect(component.playerService.isPlaying).toBeTrue();
    playButton.click();
    expect(component.playerService.isPlaying).toBeFalse();
  }))
  it('should detect file input change and set uploadedFile  model', () => {
    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(new File([''], 'test-file.wav'))

    const inputDebugEl  = fixture.debugElement.query(By.css('input[type=file]'));
    inputDebugEl.nativeElement.files = dataTransfer.files;

    inputDebugEl.nativeElement.dispatchEvent(new InputEvent('change'));

    fixture.detectChanges();

    expect(component.uploadingFile).toBeTruthy()
    expect(component.uploadingFile.name).toBe('test-file.wav')
    
});

});
