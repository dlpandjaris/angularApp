import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subscription, timer } from 'rxjs';
import { PlaybackState } from '../models/playback-state';
import { Device } from '../models/device';
import { Track } from '../models/track';
import * as fromPlayerActions from '../state/actions/player.actions';
import { Store } from '@ngrx/store';
import { SpotifyAppState } from '../state';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl: string = "https://api.spotify.com/v1/me";
  private accessToken = localStorage.getItem("accessToken");

  timer: Observable<number> = timer(500, 1000);
  timerSubscription!: Subscription; 

  constructor(
    private http: HttpClient,
    private store: Store<SpotifyAppState>
  ) { }

  get_playback_state(): Observable<PlaybackState> {
    return this.http.get<PlaybackState>(`${this.baseUrl}/player`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }
  
  transfer_playback(device_ids: string[], play: boolean = false): Observable<any> {
    return this.http.put(`${this.baseUrl}/player`, 
      { "device_ids": device_ids, "play": play }, 
      { headers: { Authorization: `Bearer ${this.accessToken}` } }
    )
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
  
  play(device_id: string, uris: string[] = [], position_ms: number = 0): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/play`, {
      uris: uris,
      position_ms: position_ms,
    }, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { device_id: device_id }
    })
  }

  play_multiple_tracks(device_id: string, uris: string[] = []): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/play`, {
      uris: uris,
    }, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { device_id: device_id }
    })
  }

  resume(device_id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/play`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { device_id: device_id }
    })
  }

  play_artist_or_playlist(device_id: string, context_uri: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/play`, {
      context_uri: context_uri
    }, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { device_id: device_id }
    })
  }

  pause(device_id?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/pause`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    })
  }
  
  skip_to_next(): Observable<any> {
    return this.http.post(`${this.baseUrl}/player/next`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  skip_to_previous(): Observable<any> {
    return this.http.post(`${this.baseUrl}/player/previous`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  seek_to_position(position_ms: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/seek`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { position_ms: position_ms }
    })
  }

  repeat(state: string, device_id?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/repeat`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { state: state, }
    })
  }

  set_playback_volume(volume_percent: number): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/volume`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { volume_percent: volume_percent }
    })
  }

  shuffle(state: boolean, device_id?: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/player/shuffle`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { state: state, }
    })
  }

  get_recently_played_tracks(): Observable<Track[]> {
    return this.http.get<Track[]>(`${this.baseUrl}/player/recently-played`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  get_users_queue(): Observable<{
    currently_playing: Track,
    queue: Track[]
  }> {
    return this.http.get<{
      currently_playing: Track,
      queue: Track[]
    }>(`${this.baseUrl}/player/queue`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    });
  }

  add_item_to_playback_queue(uri: string, device_id?: string): void {
    this.http.post(`${this.baseUrl}/player/queue`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { uri: uri }
    }).subscribe();
  }
}