import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistGridItemComponent } from './artist-grid-item.component';

describe('ArtistGridItemComponent', () => {
  let component: ArtistGridItemComponent;
  let fixture: ComponentFixture<ArtistGridItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArtistGridItemComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArtistGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
