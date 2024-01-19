import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { TopTrackList } from '../../models/top-track-list';
import { TopArtistList } from '../../models/top-artist-list';
import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';

import { UsersService } from '../../services/users.service';
import { PlayerService } from '../../services/player.service';
import { TrackService } from '../../services/track.service';
import { PlaybackState } from '../../models/playback-state';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  playbackState$: Observable<PlaybackState>;

  iconProvider = IconProvider;
  playIcon: string = IconProvider.bigPlay;
  is_playing: boolean = false;

  isFavorite: boolean[] = [];

  term: string = "long_term";
  top_type: string = "tracks";
  top_tracks: Track[] = [];
  top_artists: Artist[] = [];
  user_profile!: UserProfile;

  accessToken = localStorage.getItem("accessToken");

  constructor(
    private usersService: UsersService,
    private playerService: PlayerService,
    private trackService: TrackService) { 
      this.playbackState$ = this.playerService.get_playback_state_subject();
    }

  async ngOnInit(): Promise<void> {
    await this.fetchTopTracks();
    await this.fetchTopArtists();
    // await this.checkFavorites();
    await this.usersService.getCurrentUsersProfile()
    .subscribe((prof: UserProfile) => {
      this.user_profile = prof;
    })

    
    this.playerService.refresh_playback_state();
  }

  async fetchTopItems() {
    this.top_type == 'tracks' ? this.fetchTopTracks(): this.fetchTopArtists();
  }

  async fetchTopTracks() {
    this.usersService.getTopTracks(this.term)
      .subscribe((result: TopTrackList) => {
        this.top_tracks = result.items;
    })
  }

  async fetchTopArtists() {
    this.usersService.getTopArtists(this.term)
      .subscribe((result: TopArtistList) => {
        this.top_artists = result.items;
        this.checkFavorites();
    })
  }

  async checkFavorites() {
    let ids: string = '';
    for (let track of this.top_tracks) {
      ids = ids + track.id + ',';
    }
    ids = ids.slice(0, ids.length - 1);

    this.trackService.check_users_saved_tracks(ids)
    .subscribe((result: boolean[])=>{
      this.isFavorite = result;
      // this.isFavorite ? this.favoriteIconColor = this.green: this.favoriteIconColor = this.gray;
      // this.isFavorite ? this.favoriteIcon = IconProvider.favorited: this.favoriteIcon = IconProvider.unfavorited;
    })
  }

  setTopType(top_type: string) {
    this.top_type = top_type;
    this.fetchTopItems();
  }


  setTerm(term: string) {
    this.term = term;
    this.fetchTopItems()
  }

  async toggle_play_track(track: Track): Promise<void> {
    this.is_playing ? this.playerService.pause() : this.playerService.play(track.uri);
    // this.is_playing ? this.playIcon = IconProvider.bigPlay: this.playIcon = IconProvider.bigPause;
    this.is_playing = !this.is_playing;
  }

  toggle_play(): void {

  }

  get_artist_list(track: Track): string {
    let artists = '';
    for (let artist of track.artists) {
      artists = artists + artist.name + ', ';
    }
    return artists.slice(0, artists.length - 2);
  }

  ms_to_min_sec(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = (`0${(Math.floor(ms / 1000) - (minutes * 60)).toString()}`).slice(-2);
    return `${minutes}:${seconds}`;
  }

  format_date(inputDate: string): string {
    const monthNames: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const dateParts: string[] = inputDate.split('-');
    const monthAbbreviation: string = monthNames[parseInt(dateParts[1], 10) - 1];
    const day: string = parseInt(dateParts[2], 10).toString();
    const year: string = dateParts[0];

    return `${monthAbbreviation} ${day}, ${year}`;
  }

  toggle_favorite(index: number): void {
    this.isFavorite[index] ? this.trackService.remove_users_saved_tracks([this.top_tracks[index].id]): this.trackService.save_tracks_for_current_user([this.top_tracks[index].id]);
    this.isFavorite[index] = !this.isFavorite[index];
  }
}
