import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';

import { SpotifyAppState } from '../../state';
import { selectUserProfile } from '../../state/selectors/user-profile.selectors';
import { getUserProfile } from '../../state/actions/user-profile.actions';
// import { CdkDrag } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-spotify-layout',
  templateUrl: './spotify-layout.component.html',
  styleUrl: './spotify-layout.component.scss',
  // imports: [CdkDrag]
})
export class SpotifyLayoutComponent {

  iconProvider = IconProvider;
  userProfile$!: Observable<UserProfile>;

  @ViewChild('leftContainer') leftContainerRef!: ElementRef;
  @ViewChild('rightContainer') rightContainerRef!: ElementRef;

  leftContainerWidth: number = 60;
  rightContainerWidth: number = 40;
  dragStartX: number = 0;
  dragging: boolean = false;

  constructor(
    private store: Store<SpotifyAppState>,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getUserProfile());
    this.userProfile$ = this.store.select(selectUserProfile);
  }

  startResize(event: MouseEvent): void {
    this.dragStartX = event.clientX;
    this.dragging = true;
  }

  @HostListener('document:mousemove', ['$event'])
  onDrag(event: MouseEvent): void {
    if (this.dragging) {
      const totalWidth = this.leftContainerRef.nativeElement.clientWidth + this.rightContainerRef.nativeElement.clientWidth;
      const deltaX = event.clientX - this.dragStartX;

      this.leftContainerWidth += 100 * (deltaX / totalWidth);
      this.rightContainerWidth -= 100 * (deltaX / totalWidth);
      this.dragStartX = event.clientX;
    }
  }

  @HostListener('document:mouseup')
  stopResize(): void {
    if (this.dragging) {
      this.dragging = false;

      const event: CustomEvent = new CustomEvent('setHeaderTitleSize', {
        bubbles: true,
        detail: ''
      });

      this.elementRef.nativeElement.dispatchEvent(event);
    }
  }
}
