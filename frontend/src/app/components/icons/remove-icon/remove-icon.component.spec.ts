import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveIconComponent } from './remove-icon.component';

describe('RemoveIconComponent', () => {
  let component: RemoveIconComponent;
  let fixture: ComponentFixture<RemoveIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
