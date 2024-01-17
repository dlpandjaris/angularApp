import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopTrackList } from '../models/top-track-list';
import { TopArtistList } from '../models/top-artist-list';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = "https://api.spotify.com/v1/me";
  accessToken = localStorage.getItem("accessToken");

  constructor(private http: HttpClient) { }

  getCurrentUsersProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.baseUrl}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    })
  }

  getTopTracks(time_range: string): Observable<TopTrackList> {
    return this.http.get<TopTrackList>(`${this.baseUrl}/top/tracks`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { time_range: time_range, limit: 50 }
    });
  }

  getTopArtists(time_range: string): Observable<TopArtistList> {
    return this.http.get<TopArtistList>(`${this.baseUrl}/top/artists`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { time_range: time_range, limit: 50 }
    });
  }
}
