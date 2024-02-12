import { HostListener, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Track } from '../../models/track';
import { TopTrackList } from '../../models/top-track-list';
import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';

import { UsersService } from '../../services/users.service';
import { TrackService } from '../../services/track.service';
import { PlaybackState } from '../../models/playback-state';
import { Store } from '@ngrx/store';
import * as fromPlayerActions from '../../state/actions/player.actions';
import { SpotifyAppState } from '../../state';
import { selectPlayer } from '../../state/selectors/player.selectors';
import { selectUserProfile } from '../../state/selectors/user-profile.selectors';

@Component({
  selector: 'app-top-tracks',
  templateUrl: './top-tracks.component.html',
  styleUrls: ['./top-tracks.component.scss']
})
export class TopTracksComponent implements OnInit {

  playbackState$!: Observable<PlaybackState>;
  userProfile$!: Observable<UserProfile>;
  isFavorite: boolean[] = [];
  playlistPlaying: boolean = false;

  iconProvider = IconProvider;

  term: string = "medium_term";
  sort_count: number = 0;
  sort_column: string = '';
  background_color: string = 'rgb(83, 83, 83)';
  
  top_tracks: Track[] = [];

  constructor(
    private usersService: UsersService,
    private trackService: TrackService,
    private store: Store<SpotifyAppState>
  ) { }

  async ngOnInit(): Promise<void> {
    this.playbackState$ = this.store.select(selectPlayer);
    this.userProfile$ = this.store.select(selectUserProfile);

    await this.fetchTopTracks();
  }

  async fetchTopTracks() {
    this.usersService.getTopTracks(this.term)
      .subscribe((result: TopTrackList) => {
        this.top_tracks = result.items;
        this.checkFavorites();
    })
  }
  
  checkFavorites() {
    let ids: string = '';
    for (let track of this.top_tracks) {
      ids = ids + track.id + ',';
    }
    ids = ids.slice(0, ids.length - 1);

    this.trackService.check_users_saved_tracks(ids)
    .subscribe((result: boolean[])=>{
      this.isFavorite = result;
    })
  }


  @HostListener('setBackgroundColor', ['$event'])
  set_background_color(event: any) {
    const color = event.detail;
    this.background_color = color;
  }

  @HostListener('setTopTerm', ['$event'])
  set_top_term(event: any) {
    const term = event.detail;
    this.term = term;
    this.sort_count = 0;
    this.fetchTopTracks();
  }

  toggle_play_all(): void {
    if (this.playlistPlaying) {
      this.store.dispatch(fromPlayerActions.togglePlayFooter());
    } else {
      const tracks = this.sort_tracks().map((track) => track.track);
      this.store.dispatch(fromPlayerActions.playTracksTop({ tracks: tracks }));
      this.playlistPlaying = true;
    }
  }

  sort_tracks(): {rank: number, track: Track}[] {
    let init_tracks: {rank: number, track: Track}[] = []
    this.top_tracks.forEach((track, index) => {
      init_tracks.push({rank: index, track: track});
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

  get_total_duration(): string {
    let total_ms: number = 0;
    for (let track of this.top_tracks) {
      total_ms = total_ms + track.duration_ms;
    }
    const hour_min = this.ms_to_hour_min(total_ms);
    return `${hour_min[0]} hr ${hour_min[1]} min`;
  }

  @HostListener('toggleFavoriteTrack', ['$event'])
  toggle_favorite(event: any) {
    const rank = event.detail;
    this.isFavorite[rank] = !this.isFavorite[rank];
  }
}
