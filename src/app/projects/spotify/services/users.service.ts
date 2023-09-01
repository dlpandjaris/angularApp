import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopTrackList } from '../models/top-track-list';
import { TopArtistList } from '../models/top-artist-list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = "https://api.spotify.com/v1/me";

  constructor(private http: HttpClient) { }

  // getTopItems(token: string, type: string, time_range: string) {
  //   return this.http.get<any>(`${this.baseUrl}/top/${type}`, {
  //     headers: { Authorization: `Bearer ${token}` },
  //     params: { time_range: time_range, limit: 50 }
  //   });
  // }

  getTopTracks(token: string, time_range: string): Observable<TopTrackList> {
    return this.http.get<TopTrackList>(`${this.baseUrl}/top/tracks`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { time_range: time_range, limit: 50 }
    });
  }

  getTopArtists(token: string, time_range: string): Observable<TopArtistList> {
    return this.http.get<TopArtistList>(`${this.baseUrl}/top/artists`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { time_range: time_range, limit: 50 }
    });
  }
}
