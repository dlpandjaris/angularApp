import { Component, OnInit } from '@angular/core';
import { UserProfile } from '../../models/user-profile';
import { UsersService } from '../../services/users.service';
import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-spotify',
  templateUrl: './spotify.component.html',
  styleUrls: ['./spotify.component.scss']
})
export class SpotifyComponent implements OnInit {

  clientId: string = `${environment.spotify_client_id}`;

  params = new URLSearchParams(window.location.search);
  code = this.params.get("code");

  constructor(private router: Router) { }

  async ngOnInit(): Promise<void> {
    await this.checkForAuth()
  }

  public async checkForAuth(): Promise<void> {
    if (!this.code) {
      this.redirectToAuthCodeFlow();
    } else {
      this.getAccessToken();
      this.router.navigate(['projects/spotify']);
    }
  }

  async redirectToAuthCodeFlow() {  
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
    params.append("client_id", this.clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", `${environment.domain}/projects/spotify/auth`);
    params.append("scope", "user-read-private user-read-email user-top-read" 
                         +" user-read-playback-state user-modify-playback-state"
                         +" playlist-read-private playlist-modify-public"
                         +" playlist-modify-private playlist-read-collaborative"
                         +" user-library-read user-library-modify streaming");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  async getAccessToken(): Promise<void> {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", this.clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", this.code!);
    params.append("redirect_uri", `${environment.domain}/projects/spotify/auth`);
    params.append("code_verifier", verifier!);

    const result = await fetch("https://accounts.spotify.com/api/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
    });

    const { access_token } = await result.json();
    localStorage.setItem("accessToken", access_token);
  }
}
