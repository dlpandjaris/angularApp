import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models/user-profile';
import { UsersService } from '../../services/users.service';
import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { TopTrackList } from '../../models/top-track-list';
import { TopArtistList } from '../../models/top-artist-list';

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit {

  clientId: string = "0ed7ab195c894741a89cdbd2f8a7f573";
  params = new URLSearchParams(window.location.search);
  code = this.params.get("code");
  accessToken!: string;

  page: string = "user";
  term: string = "medium_term";
  top_type: string = "tracks";

  user_profile!: UserProfile;
  top_tracks: Track[] = [];
  top_artists: Artist[] = [];
  top_items: any = [];

  constructor(private usersService: UsersService) { }

  async ngOnInit(): Promise<void> {
    await this.checkForAuth()
    await this.fetchTopTracks()
    await this.fetchTopArtists()
  }

  public async checkForAuth(): Promise<void> {
    if (!this.code) {
      this.redirectToAuthCodeFlow(this.clientId);
    } else {
      this.accessToken = await this.getAccessToken(this.clientId, this.code);
      this.user_profile = await this.fetchProfile();
    }
  }

  async redirectToAuthCodeFlow(clientId: string) {  
    function generateCodeVerifier(length: number) {
        let text = '';
        let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
    
    async function generateCodeChallenge(codeVerifier: string) {
      const data = new TextEncoder().encode(codeVerifier);
      const digest = await window.crypto.subtle.digest('SHA-256', data);
      return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
    }

    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://localhost:4200/projects/spotify");
    params.append("scope", "user-read-private user-read-email user-top-read");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getAccessToken(clientId: string, code: string) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:4200/projects/spotify");
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async fetchProfile(): Promise<UserProfile> {
    const result = await fetch("https://api.spotify.com/v1/me", {
      method: "GET", headers: { Authorization: `Bearer ${this.accessToken}` }
    });

    return await result.json();
  }

  async fetchTopItems() {
    if(this.top_type == 'tracks') {
      this.fetchTopTracks();
    } else {
      this.fetchTopArtists();
    }
    console.log(`fetched top ${this.top_type}`)
    // this.top_items = [];
    // this.usersService.getTopItems(this.accessToken, this.top_type, this.term)
    //   .subscribe(result => this.top_items = result.items);
    // console.log('fetched top items');
  }

  async fetchTopTracks() {
    this.usersService.getTopTracks(this.accessToken, this.term)
      .subscribe((result: TopTrackList) => {
        this.top_tracks = result.items;
    })
  }

  async fetchTopArtists() {
    this.usersService.getTopArtists(this.accessToken, this.term)
      .subscribe((result: TopArtistList) => {
        this.top_artists = result.items;
    })
  }

  setPage(page: string) {
    this.page = page;
    console.log(`navigating to ${this.page}`)
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
