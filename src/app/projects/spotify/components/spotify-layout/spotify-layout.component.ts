import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';

import { SpotifyAppState } from '../../state';
import { selectUserProfile } from '../../state/selectors/user-profile.selectors';
import { getUserProfile } from '../../state/actions/user-profile.actions';

@Component({
  selector: 'app-spotify-layout',
  templateUrl: './spotify-layout.component.html',
  styleUrl: './spotify-layout.component.scss'
})
export class SpotifyLayoutComponent {

  iconProvider = IconProvider;
  userProfile$!: Observable<UserProfile>;

  constructor(
    private store: Store<SpotifyAppState>
  ) {}

  ngOnInit(): void {
    this.store.dispatch(getUserProfile());
    this.userProfile$ = this.store.select(selectUserProfile);
  }
}
