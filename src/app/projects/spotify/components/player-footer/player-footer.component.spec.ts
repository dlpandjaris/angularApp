import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerFooterComponent } from './player-footer.component';

describe('PlayerFooterComponent', () => {
  let component: PlayerFooterComponent;
  let fixture: ComponentFixture<PlayerFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlayerFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
