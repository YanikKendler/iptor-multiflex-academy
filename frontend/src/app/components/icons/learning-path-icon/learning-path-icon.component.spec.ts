import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPathIconComponent } from './learning-path-icon.component';

describe('LearningPathIconComponent', () => {
  let component: LearningPathIconComponent;
  let fixture: ComponentFixture<LearningPathIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPathIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningPathIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
