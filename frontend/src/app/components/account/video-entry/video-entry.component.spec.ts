import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoEntryComponent } from './video-entry.component';

describe('VideoEntryComponent', () => {
  let component: VideoEntryComponent;
  let fixture: ComponentFixture<VideoEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoEntryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
