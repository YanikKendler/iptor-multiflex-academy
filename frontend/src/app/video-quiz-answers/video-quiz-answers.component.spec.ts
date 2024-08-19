import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoQuizAnswersComponent } from './video-quiz-answers.component';

describe('VideoQuizAnswersComponent', () => {
  let component: VideoQuizAnswersComponent;
  let fixture: ComponentFixture<VideoQuizAnswersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoQuizAnswersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoQuizAnswersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
