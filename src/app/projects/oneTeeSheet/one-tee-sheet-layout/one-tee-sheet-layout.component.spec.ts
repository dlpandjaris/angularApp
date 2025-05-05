import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTeeSheetLayoutComponent } from './one-tee-sheet-layout.component';

describe('OneTeeSheetLayoutComponent', () => {
  let component: OneTeeSheetLayoutComponent;
  let fixture: ComponentFixture<OneTeeSheetLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OneTeeSheetLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OneTeeSheetLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
