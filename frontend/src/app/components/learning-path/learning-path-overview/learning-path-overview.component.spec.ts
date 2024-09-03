import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearningPathOverviewComponent } from './learning-path-overview.component';

describe('LearningPathOverviewComponent', () => {
  let component: LearningPathOverviewComponent;
  let fixture: ComponentFixture<LearningPathOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LearningPathOverviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LearningPathOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
