import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRatingComponent } from './video-rating.component';

describe('VideoRatingComponent', () => {
  let component: VideoRatingComponent;
  let fixture: ComponentFixture<VideoRatingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoRatingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
