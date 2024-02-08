import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Track } from '../models/track';
import { AudioFeatures } from '../models/audio-features';

@Injectable({
  providedIn: 'root'
})
export class TrackService {

  private baseUrl: string = "https://api.spotify.com/v1";
  accessToken = localStorage.getItem("accessToken");

  constructor(private http: HttpClient) { }

  get_track(id: string): Observable<Track> {
    return this.http.get<Track>(`${this.baseUrl}/tracks/${id}`, {
      headers: { Authorization: `Bearer ${this.baseUrl}` }
    })
  }

  get_tracks(ids: string): Observable<Track> {
    return this.http.get<Track>(`${this.baseUrl}/tracks`, {
      headers: { Authorization: `Bearer ${this.baseUrl}` },
      params: { ids: ids }
    })
  }

  get_users_saved_tracks(limit: number, offset: number): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.baseUrl}/me/tracks`, {
      headers: { Authorization: `Bearer ${this.baseUrl}` },
      params: { limit: limit, offset: offset }
    })
  }

  save_tracks_for_current_user(ids: string[]): void {
    this.http.put(`${this.baseUrl}/me/tracks`, {
      ids: ids
    }, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe();
  }
  
  remove_users_saved_tracks(ids: string[]): void {
    this.http.delete(`${this.baseUrl}/me/tracks`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      body: { ids: ids }
    }).subscribe();
  }

  check_users_saved_tracks(ids: string): Observable<boolean[]> {
    return this.http.get<boolean[]>(`${this.baseUrl}/me/tracks/contains`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { ids: ids }
    })
  }

  get_tracks_audio_features(ids: string): Observable<AudioFeatures[]> {
    return this.http.get<AudioFeatures[]>(`/audio-features`, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { ids: ids }
    })
  }

  get_track_audio_features(id: string): Observable<AudioFeatures> {
    return this.http.get<AudioFeatures>(`/audio-features/${id}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    })
  }

  // TODO: finish this with object
  get_track_audio_analysis(id: string): Observable<AudioFeatures> {
    return this.http.get<AudioFeatures>(`/audio-analysis/${id}`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    })
  }

  // add_items_to_playlist(playlist_id: string, position: number, uris: string[]): void {
  //   this.http.post(`${this.baseUrl}/playlists/${playlist_id}/tracks`, {}, {
  //     headers: { Authorization: `Bearer ${this.accessToken}` },
  //     params: { position: position, uris: uris }
  //   }).subscribe();
  // }
}