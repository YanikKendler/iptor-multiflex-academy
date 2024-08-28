import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentEditHistoryComponent } from './content-edit-history.component';

describe('ContentEditHistoryComponent', () => {
  let component: ContentEditHistoryComponent;
  let fixture: ComponentFixture<ContentEditHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentEditHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentEditHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
