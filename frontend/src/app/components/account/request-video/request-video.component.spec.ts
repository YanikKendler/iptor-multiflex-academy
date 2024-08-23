import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestVideoComponent } from './request-video.component';

describe('RequestVideoComponent', () => {
  let component: RequestVideoComponent;
  let fixture: ComponentFixture<RequestVideoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestVideoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RequestVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
