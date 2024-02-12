import { Component, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Playlist } from '../../models/playlist';
import { PlaylistService } from '../../services/playlist.service';
import { TrackService } from '../../services/track.service';
import { Store } from '@ngrx/store';
import { SpotifyAppState } from '../../state';
import { Observable, concatMap } from 'rxjs';
import { IconProvider } from '../../models/icon-provider';
import { Context } from '../../models/context';
import { selectContext, selectIsPlaying } from '../../state/selectors/player.selectors';
import { PlaylistTrack } from '../../models/playlist-track';
import { Track } from '../../models/track';
import { Image } from '../../models/image';
import * as fromPlayerActions from '../../state/actions/player.actions';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrl: './playlist.component.scss'
})
export class PlaylistComponent {

  playlist$!: Observable<Playlist>;
  context$!: Observable<Context>;
  isPlaying$!: Observable<boolean>;
  isFavorite: boolean[] = [];

  iconProvider = IconProvider;

  sort_count: number = 0;
  sort_column: string = '';
  background_color: string = 'rgb(83, 83, 83)';

  constructor(
    private route: ActivatedRoute,
    private playlistService: PlaylistService,
    private trackService: TrackService,
    private store: Store<SpotifyAppState>,
  ) {}

  ngOnInit() {
    this.context$ = this.store.select(selectContext);
    this.isPlaying$ = this.store.select(selectIsPlaying);

    this.playlist$ = this.route.paramMap.pipe(
      concatMap(params => {
        let playlist_id = params.get('playlist_id')
        if (!playlist_id) {
          return new Observable<Playlist>();
        }
        return this.getPlaylist(playlist_id);
      })
    );
    this.playlist$.subscribe(
      (playlist: Playlist) => this.checkFavorites(playlist)
    )
  }

  getPlaylist(playlist_id: string): Observable<Playlist> {
    return this.playlistService.get_playlist(playlist_id);
  }

  checkFavorites(playlist: Playlist) {
    this.isFavorite = []
    const numChunks = Math.ceil(playlist.tracks.items.length / 50);
    for (let i = 0; i < numChunks; i++) {
      let ids: string = '';
      for (let track of playlist.tracks.items.slice(i*50, (i+1)*50)) {
        ids = ids + track.track.id + ',';
      }
      ids = ids.slice(0, ids.length - 1);

      this.trackService.check_users_saved_tracks(ids)
      .subscribe((result: boolean[])=>{
        result.forEach((isFavorite: boolean) => this.isFavorite.push(isFavorite))
      })
    }
  }

  @HostListener('toggleFavoriteTrack', ['$event'])
  toggle_favorite(event: any) {
    const rank = event.detail;
    this.isFavorite[rank] = !this.isFavorite[rank];
  }

  @HostListener('setBackgroundColor', ['$event'])
  set_background_color(event: any) {
    const color = event.detail;
    this.background_color = color;
  }

  toggle_play(playlist: Playlist): void {
    this.store.dispatch(fromPlayerActions.playPlaylist({ playlist }));
  }

  sort_tracks(tracks: PlaylistTrack[]): {rank: number, track: Track}[] {
    let init_tracks: {rank: number, track: Track}[] = []
    tracks.forEach((track, index) => {
      init_tracks.push({rank: index, track: track.track});
    });

    switch (this.sort_count) {
      default: {
        return init_tracks;
      }
      case 1: {
        switch (this.sort_column) {
          default: {
            return init_tracks;
          }
          case 'title': {
            return init_tracks.sort((a, b) => a.track.name > b.track.name ? 1 : -1);
          }
          case 'album': {
            return init_tracks.sort((a, b) => a.track.album.name > b.track.album.name ? 1 : -1);
          }
          case 'release': {
            return init_tracks.sort((a, b) => a.track.album.release_date > b.track.album.release_date ? 1 : -1);
          }
          case 'duration': {
            return init_tracks.sort((a, b) => a.track.duration_ms > b.track.duration_ms ? 1 : -1);
          }
        }
      }
      case 2: {
        switch (this.sort_column) {
          default: {
            return init_tracks;
          }
          case 'title': {
            return init_tracks.sort((a, b) => a.track.name > b.track.name ? -1 : 1);
          }
          case 'album': {
            return init_tracks.sort((a, b) => a.track.album.name > b.track.album.name ? -1 : 1);
          }
          case 'release': {
            return init_tracks.sort((a, b) => a.track.album.release_date > b.track.album.release_date ? -1 : 1);
          }
          case 'duration': {
            return init_tracks.sort((a, b) => a.track.duration_ms > b.track.duration_ms ? -1 : 1);
          }
        }
      }
    }
  }

  toggle_sort(sort_column: string): void {
    this.sort_column == sort_column ? (
      this.sort_count >= 2 ? this.sort_count = 0 : this.sort_count = this.sort_count + 1
    ): (
      this.sort_column = sort_column,
      this.sort_count = 1
    )
  }

  ms_to_hour_min(ms: number): string[] {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = (`0${(Math.floor(ms / (1000 * 60)) - (hours * 60)).toString()}`).slice(-2);
    return [hours.toString(), minutes];
  }

  get_total_duration(tracks: PlaylistTrack[]): string {
    let total_ms: number = 0;
    tracks.forEach((track) => {
      total_ms = total_ms + track.track.duration_ms;
    });
    const hour_min = this.ms_to_hour_min(total_ms);
    return `${hour_min[0]} hr ${hour_min[1]} min`;
  }

  select_cover_image(images: Image[]): string {
    let url: string = images[0].url;
    for (let image of images) {
      if (image.width == 300 || image.height == 300) {
        url = image.url;
        break;
      }
    }

    return url;
  }
}
