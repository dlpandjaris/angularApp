import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalContentComponent } from './terminal-content.component';

describe('TerminalContentComponent', () => {
  let component: TerminalContentComponent;
  let fixture: ComponentFixture<TerminalContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TerminalContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TerminalContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
