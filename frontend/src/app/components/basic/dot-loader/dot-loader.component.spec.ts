import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DotLoaderComponent } from './dot-loader.component';

describe('DotLoaderComponent', () => {
  let component: DotLoaderComponent;
  let fixture: ComponentFixture<DotLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DotLoaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DotLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
