import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaybackState } from '../models/playback-state';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl: string = "https://api.spotify.com/v1/me";
  accessToken = localStorage.getItem("accessToken");

  constructor(private http: HttpClient) { }

  play(device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/play`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe();
  }

  pause(device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/pause`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe();
  }

  get_playback_state(): Observable<PlaybackState> {
    return this.http.get<PlaybackState>(`${this.baseUrl}/player`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  skip_to_next(): void {
    this.http.post(`${this.baseUrl}/player/next`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe();
  }

  skip_to_previous(): void {
    this.http.post(`${this.baseUrl}/player/previous`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe();
  }

  shuffle(state: boolean, device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/shuffle`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { state: state, }
    }).subscribe();
  }

  repeat(state: string, device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/repeat`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { state: state, }
    }).subscribe();
  }
}