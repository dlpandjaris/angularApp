import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Playlist } from '../models/playlist';
import { PlaylistDetails } from '../models/playlist-details';
import { Track } from '../models/track';
import { PlaylistUpdate } from '../models/playlist-update';
import { PlaylistPage } from '../models/playlist-page';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private baseUrl: string = "https://api.spotify.com/v1";
  accessToken = localStorage.getItem("accessToken");

  constructor(private http: HttpClient) { }

  get_playlist(playlist_id: string): Observable<Playlist> {
    return this.http.get<Playlist>(`${this.baseUrl}/playlists/${playlist_id}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })
  }

  change_playlist_details(playlist_id: string, playlist_details: PlaylistDetails): void {
    this.http.put(`${this.baseUrl}/playlists/${playlist_id}`, {
      name: playlist_details.name,
      public: playlist_details.public,
      collaborative: playlist_details.collaborative,
      description: playlist_details.description
    }, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
    })
  }

  get_playlist_items(playlist_id: string, limit: number, offset: number): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.baseUrl}/playlists/${playlist_id}/tracks`, {
      headers: { Authorization: `Bearer ${this.baseUrl}` },
      params: { limit: limit, offset: offset }
    })
  }

  update_playlist_items(playlist_id: string, uris: string, playlist_update: PlaylistUpdate): void {
    this.http.put(`${this.baseUrl}/playlists/${playlist_id}/tracks`, {
      uris: playlist_update.uris,
      range_start: playlist_update.range_start,
      insert_before: playlist_update.insert_before,
      range_length: playlist_update.range_length,
      snapshot_id: playlist_update.snapshot_id
    }, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    })
  }

  add_items_to_playlist(playlist_id: string, position: number, uris: string[]): void {
    this.http.post(`${this.baseUrl}/playlists/${playlist_id}/tracks`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { position: position, uris: uris }
    }).subscribe();
  }

  remove_playlist_items(playlist_id: string, tracks: Track[], snapshot_id: string) {
    this.http.delete(`${this.baseUrl}/playlists/${playlist_id}/tracks`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: { tracks: tracks, snapshot_id: snapshot_id }
    }).subscribe();
  }

  get_current_users_playlist(limit: number, offset: number): Observable<PlaylistPage> {
    return this.http.get<PlaylistPage>(`${this.baseUrl}/me/playlists`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { limit: limit, offset: offset }
    })
  }

  get_users_playlists(user_id: string, limit: number, offset: number): Observable<PlaylistPage> {
    return this.http.get<PlaylistPage>(`${this.baseUrl}/users/${user_id}/playlists`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { user_id: user_id, limit: limit, offset: offset }
    })
  }

  create_playlist() {
    
  }

  // get(playlist_id: string): void {
  //   this.http.put(`${this.baseUrl}/playlists/play`, {}, {
  //     headers: { Authorization: `Bearer ${this.accessToken}` },
  //     params: { playlist_id: playlist_id }
  //   }).subscribe();
  // }

  // get_playback_state(): Observable<PlaybackState> {
  //   return this.http.get<PlaybackState>(`${this.baseUrl}/player`, {
  //     headers: { Authorization: `Bearer ${this.accessToken}` }
  //   });
  // }

  // skip_to_next(): void {
  //   this.http.post(`${this.baseUrl}/player/next`, {}, {
  //     headers: { Authorization: `Bearer ${this.accessToken}` }
  //   }).subscribe();
  // }
}