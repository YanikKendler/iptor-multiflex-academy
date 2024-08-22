import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserFieldComponent } from './manage-user-field.component';

describe('ManageUserFieldComponent', () => {
  let component: ManageUserFieldComponent;
  let fixture: ComponentFixture<ManageUserFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUserFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
