import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoCommentContainerComponent } from './video-comment-container.component';

describe('VideoCommentsComponent', () => {
  let component: VideoCommentContainerComponent;
  let fixture: ComponentFixture<VideoCommentContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoCommentContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoCommentContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
