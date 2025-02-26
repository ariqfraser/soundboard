import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioMixerComponent } from './audio-mixer.component';

describe('AudioMixerComponent', () => {
  let component: AudioMixerComponent;
  let fixture: ComponentFixture<AudioMixerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioMixerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioMixerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
