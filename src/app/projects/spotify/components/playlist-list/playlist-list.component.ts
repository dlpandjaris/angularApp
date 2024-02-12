import { Component } from '@angular/core';
import { Playlist } from '../../models/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { PlaylistPage } from '../../models/playlist-page';
import { IconProvider } from '../../models/icon-provider';
import { Observable } from 'rxjs';
import { Context } from '../../models/context';
import { Store } from '@ngrx/store';
import { SpotifyAppState } from '../../state';
import { selectContext, selectIsPlaying } from '../../state/selectors/player.selectors';
import * as fromPlayerActions from '../../state/actions/player.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.component.html',
  styleUrl: './playlist-list.component.scss'
})
export class PlaylistListComponent {

  context$!: Observable<Context>;
  isPlaying$!: Observable<boolean>;
  playlists: Playlist[] = [];

  iconProvider = IconProvider;

  constructor(
    private playlistService: PlaylistService,
    private store: Store<SpotifyAppState>,
    private router: Router
  ) {}

  ngOnInit() {
    this.context$ = this.store.select(selectContext);
    this.isPlaying$ = this.store.select(selectIsPlaying);
    this.get_playlists();
  }

  get_playlists(): void {
    this.playlistService.get_current_users_playlist(50, 0)
      .subscribe((playlistPage: PlaylistPage) => {
        this.playlists = playlistPage.items;
      })
  }

  play_playlist(playlist: Playlist) {
    this.store.dispatch(fromPlayerActions.playPlaylist({playlist}));
  }

  navigate_to_playlist(playlist: Playlist): void {
    this.router.navigateByUrl(`projects/spotify/playlists/${playlist.id}`);
  }
}