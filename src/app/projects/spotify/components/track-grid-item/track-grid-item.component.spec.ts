import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongGridComponent } from './song-grid.component';

describe('SongGridComponent', () => {
  let component: SongGridComponent;
  let fixture: ComponentFixture<SongGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongGridComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SongGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
