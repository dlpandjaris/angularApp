import { Component, OnInit } from '@angular/core';
import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { UsersService } from '../../services/users.service';
import { TopTrackList } from '../../models/top-track-list';
import { TopArtistList } from '../../models/top-artist-list';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  term: string = "medium_term";
  top_type: string = "tracks";
  top_tracks: Track[] = [];
  top_artists: Artist[] = [];

  accessToken = localStorage.getItem("accessToken");

  constructor(
    private usersService: UsersService) { }

  async ngOnInit(): Promise<void> {
    await this.fetchTopTracks()
    await this.fetchTopArtists()
  }

  async fetchTopItems() {
    if(this.top_type == 'tracks') {
      this.fetchTopTracks();
    } else {
      this.fetchTopArtists();
    }
    console.log(`fetched top ${this.top_type}`)
  }

  async fetchTopTracks() {
    if (this.accessToken) {
        this.usersService.getTopTracks(this.accessToken, this.term)
        .subscribe((result: TopTrackList) => {
          this.top_tracks = result.items;
      })
    }
  }

  async fetchTopArtists() {
    if (this.accessToken) {
        this.usersService.getTopArtists(this.accessToken, this.term)
        .subscribe((result: TopArtistList) => {
          this.top_artists = result.items;
      })
    }
  }

  setTopType(top_type: string) {
    this.top_type = top_type;
    this.fetchTopItems();
    console.log(`switched top_type to ${this.top_type}`)
  }


  setTerm(term: string) {
    this.term = term;
    this.fetchTopItems()
    console.log(`switched term to ${this.term}`)
  }

}
