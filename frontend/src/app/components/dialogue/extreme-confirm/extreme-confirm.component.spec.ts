import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtremeConfirmComponent } from './extreme-confirm.component';

describe('ExtremeConfirmComponent', () => {
  let component: ExtremeConfirmComponent;
  let fixture: ComponentFixture<ExtremeConfirmComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtremeConfirmComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtremeConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
