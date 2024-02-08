import { Component, HostListener } from '@angular/core';
import { Artist } from '../../models/artist';
import { Observable } from 'rxjs';
import { PlaybackState } from '../../models/playback-state';
import { UserProfile } from '../../models/user-profile';
import { Store } from '@ngrx/store';
import { UsersService } from '../../services/users.service';
import { SpotifyAppState } from '../../state';
import { selectPlayer } from '../../state/selectors/player.selectors';
import { selectUserProfile } from '../../state/selectors/user-profile.selectors';
import * as fromPlayerActions from '../../state/actions/player.actions';
import { TopArtistList } from '../../models/top-artist-list';
import { IconProvider } from '../../models/icon-provider';

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrl: './top-artists.component.scss'
})
export class TopArtistsComponent {

  playbackState$!: Observable<PlaybackState>;
  userProfile$!: Observable<UserProfile>;
  isFollowing: boolean[] = [];
  playlistPlaying: boolean = false;

  iconProvider = IconProvider;
  
  term: string = "medium_term";
  sort_count: number = 0;
  sort_column: string = '';
  background_color: string = 'rgb(83, 83, 83)';
  
  top_artists: Artist[] = [];

  constructor(
    private usersService: UsersService,
    private store: Store<SpotifyAppState>
  ) { }

  async ngOnInit(): Promise<void> {
    this.playbackState$ = this.store.select(selectPlayer);
    this.userProfile$ = this.store.select(selectUserProfile);

    await this.fetchTopArtists();
  }

  async fetchTopArtists() {
    this.usersService.getTopArtists(this.term)
      .subscribe((result: TopArtistList) => {
        this.top_artists = result.items;
        this.checkFollowing();
    })
  }

  async checkFollowing() {
    let ids: string = '';
    for (let artist of this.top_artists) {
      ids = ids + artist.id + ',';
    }
    ids = ids.slice(0, ids.length - 1);

    this.usersService.checkIfUserFollowsArtistsOrUsers('artist', ids)
    .subscribe((result: boolean[])=>{
      this.isFollowing = result;
    })
  }

  @HostListener('setBackgroundColor', ['$event'])
  set_background_color(event: any) {
    const color = event.detail;
    this.background_color = color;
  }

  @HostListener('toggleFollowArtist', ['$event'])
  toggle_favorite(event: any) {
    console.log('received event')
    const rank = event.detail;
    this.isFollowing[rank] = !this.isFollowing[rank];
  }

  toggle_play_all(): void {
    if (this.playlistPlaying) {
      this.store.dispatch(fromPlayerActions.togglePlayFooter());
    } else {
      this.store.dispatch(fromPlayerActions.playArtistTop({ artist: this.top_artists[0] }));
    }

    this.playlistPlaying = true;
  }

  setTerm(term: string) {
    if (term != this.term) {
      this.term = term;
      this.sort_count = 0;
      this.fetchTopArtists();
    }
  }

  sort_artists(): {rank: number, artist: Artist}[] {
    let init_artists: {rank: number, artist: Artist}[] = []
    this.top_artists.forEach((artist, index) => {
      init_artists.push({rank: index, artist: artist});
    });

    switch (this.sort_count) {
      default: {
        return init_artists;
      }
      case 1: {
        switch (this.sort_column) {
          default: {
            return init_artists;
          }
          case 'artist': {
            return init_artists.sort((a, b) => a.artist.name > b.artist.name ? 1 : -1);
          }
          case 'genres': {
            return init_artists.sort((a, b) => a.artist.genres > b.artist.genres ? 1 : -1);
          }
          case 'popularity': {
            return init_artists.sort((a, b) => a.artist.popularity > b.artist.popularity ? 1 : -1);
          }
        }
      }
      case 2: {
        switch (this.sort_column) {
          default: {
            return init_artists;
          }
          case 'artist': {
            return init_artists.sort((a, b) => a.artist.name > b.artist.name ? -1 : 1);
          }
          case 'genres': {
            return init_artists.sort((a, b) => a.artist.genres > b.artist.genres ? -1 : 1);
          }
          case 'popularity': {
            return init_artists.sort((a, b) => a.artist.popularity > b.artist.popularity ? -1 : 1);
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
    console.log(this.sort_column, this.sort_count);
  }
}
