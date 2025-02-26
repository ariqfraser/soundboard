import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioQueueComponent } from './audio-queue.component';

describe('AudioQueueComponent', () => {
  let component: AudioQueueComponent;
  let fixture: ComponentFixture<AudioQueueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AudioQueueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudioQueueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
