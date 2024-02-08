import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TopTrackList } from '../models/top-track-list';
import { TopArtistList } from '../models/top-artist-list';
import { Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';
import { Artist } from '../models/artist';

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

  getUsersProfile() {}

  followPlaylist(playlist_id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/playlists/${playlist_id}/followers`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  unfollowPlaylist(playlist_id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/playlists/${playlist_id}/followers`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  getFollowedArtists(type: string): Observable<Artist[]> {
    return this.http.get<Artist[]>(`${this.baseUrl}/following`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { type: type, limit: 50 }
    });
  }

  followArtistsOrUsers(type: string, ids: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/following`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { type: type, ids: ids }
    });
  }

  unfollowArtistsOrUsers(type: string, ids: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/following`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { type: type, ids: ids }
    });
  }

  checkIfUserFollowsArtistsOrUsers(type: string, ids: string): Observable<boolean[]> {
    return this.http.get<boolean[]>(`${this.baseUrl}/following/contains`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { type: type, ids: ids }
    });
  }

  checkIfUsersFollowPlaylist(playlist_id: string, ids: string): Observable<boolean[]> {
    return this.http.get<boolean[]>(`${this.baseUrl}/playlists/${playlist_id}/followers/contains`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { playlist_id: playlist_id, ids: ids }
    });
  }
}
