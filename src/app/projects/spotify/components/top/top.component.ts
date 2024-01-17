import { Component, OnInit } from '@angular/core';
import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { UsersService } from '../../services/users.service';
import { TopTrackList } from '../../models/top-track-list';
import { TopArtistList } from '../../models/top-artist-list';
import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';
import { PlayerService } from '../../services/player.service';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  iconProvider = IconProvider;
  playIcon: string = IconProvider.bigPlay;
  is_playing: boolean = false;

  term: string = "medium_term";
  top_type: string = "tracks";
  top_tracks: Track[] = [];
  top_artists: Artist[] = [];
  user_profile!: UserProfile;

  accessToken = localStorage.getItem("accessToken");

  constructor(
    private usersService: UsersService,
    private playerService: PlayerService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchTopTracks()
    await this.fetchTopArtists()
    await this.usersService.getCurrentUsersProfile().subscribe((prof: UserProfile) => {
      this.user_profile = prof;
    })
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

  async toggle_play(): Promise<void> {
    this.is_playing ? this.playerService.pause() : this.playerService.play();
    this.is_playing ? this.playIcon = IconProvider.bigPlay: this.playIcon = IconProvider.bigPause;
    this.is_playing = !this.is_playing;
  }
}
