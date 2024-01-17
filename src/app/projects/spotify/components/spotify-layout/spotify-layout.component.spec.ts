import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpotifyLayoutComponent } from './spotify-layout.component';

describe('SpotifyLayoutComponent', () => {
  let component: SpotifyLayoutComponent;
  let fixture: ComponentFixture<SpotifyLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpotifyLayoutComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SpotifyLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
