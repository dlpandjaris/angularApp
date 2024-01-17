import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PlaybackState } from '../models/playback-state';
import { Device } from '../models/device';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl: string = "https://api.spotify.com/v1/me";
  accessToken = localStorage.getItem("accessToken");
  
  constructor(private http: HttpClient) { }
  
  get_playback_state(): Observable<PlaybackState> {
    return this.http.get<PlaybackState>(`${this.baseUrl}/player`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }
  
  transfer_playback(device_ids: string[], play: boolean = false): void {
    this.http.put(`${this.baseUrl}/player`, 
      { "device_ids": device_ids, "play": play }, 
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    ).subscribe();
  }
  
  get_available_devices(): Observable<Device[]> {
    return this.http.get<Device[]>(`${this.baseUrl}/player/devices`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }
  
  get_currently_playing_track(): Observable<PlaybackState> {
    return this.http.get<PlaybackState>(`${this.baseUrl}/player/currently-playing`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }
  
  play(device_id?: string, uris: string[] = []): void {
    this.http.put(`${this.baseUrl}/player/play`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { uris: uris }
    }).subscribe();
  }

  pause(device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/pause`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe();
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

  seek_to_position(position_ms: number): void {
    this.http.put(`${this.baseUrl}/player/seek`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { position_ms: position_ms }
    }).subscribe();
  }

  repeat(state: string, device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/repeat`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { state: state, }
    }).subscribe();
  }

  set_playback_volume(volume_percent: number): void {
    this.http.put(`${this.baseUrl}/player/volume`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { volume_percent: volume_percent }
    }).subscribe();
  }

  shuffle(state: boolean, device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/shuffle`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { state: state, }
    }).subscribe();
  }


}