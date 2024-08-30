import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserSupervisorsComponent } from './manage-user-supervisors.component';

describe('ManageUserSupervisorsComponent', () => {
  let component: ManageUserSupervisorsComponent;
  let fixture: ComponentFixture<ManageUserSupervisorsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageUserSupervisorsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageUserSupervisorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
