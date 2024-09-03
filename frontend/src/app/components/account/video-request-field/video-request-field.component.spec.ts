import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoRequestFieldComponent } from './video-request-field.component';

describe('VideoRequestFieldComponent', () => {
  let component: VideoRequestFieldComponent;
  let fixture: ComponentFixture<VideoRequestFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VideoRequestFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoRequestFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
