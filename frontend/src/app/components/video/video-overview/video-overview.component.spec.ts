import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoOverviewComponent } from './video-overview.component';

describe('VideoComponent', () => {
  let component: VideoOverviewComponent;
  let fixture: ComponentFixture<VideoOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
