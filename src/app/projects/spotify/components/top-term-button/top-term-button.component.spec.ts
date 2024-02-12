import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopTermButtonComponent } from './top-term-button.component';

describe('TopTermButtonComponent', () => {
  let component: TopTermButtonComponent;
  let fixture: ComponentFixture<TopTermButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopTermButtonComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopTermButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
