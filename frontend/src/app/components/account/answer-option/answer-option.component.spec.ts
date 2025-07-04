import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnswerOptionComponent } from './answer-option.component';

describe('AnswerOptionComponent', () => {
  let component: AnswerOptionComponent;
  let fixture: ComponentFixture<AnswerOptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnswerOptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnswerOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
