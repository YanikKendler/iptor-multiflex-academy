import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyVideosComponent } from './my-videos.component';

describe('MyContentComponent', () => {
  let component: MyVideosComponent;
  let fixture: ComponentFixture<MyVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyVideosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
