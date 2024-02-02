import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, tap } from 'rxjs';
import { PlaybackState } from '../models/playback-state';
import { Device } from '../models/device';
import { Track } from '../models/track';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private baseUrl: string = "https://api.spotify.com/v1/me";
  private accessToken = localStorage.getItem("accessToken");

  private playbackState$ = new BehaviorSubject<PlaybackState>({
    device: {
      id: '',
      is_active: false,
      is_private_session: false,
      is_restricted: false,
      name: '',
      type: '',
      volume_percent: 0,
      supports_volume: false
    },
    repeat_state: 'off',
    shuffle_state: false, 
    context: {
      type: '',
      href: '',
      external_urls: {
        spotify: ''
      },
      uri: ''
    }, 
    timestamp: 0,
    progress_ms: 0,
    is_playing: false,
    item: {
      album: {
        album_type: '',
        total_tracks: '',
        available_markets: [],
        external_urls: {
          spotify: ''
        },
        href: '',
        id: '',
        images: [],
        name: '',
        release_date: '',
        release_date_precision: '',
        restrictions: {
          reason: ''
        },
        type: '',
        uri: '',
        copyrights: {
          text: '',
          type: ''
        },
        external_ids: {
          isrc: '',
          ean: '',
          upc: ''
        },
        genres: [],
        label: '',
        popularity: 0,
        album_group: '',
        artists: {
          external_urls: {
            spotify: ''
          },
          href: '',
          id: '',
          name: '',
          type: '',
          uri: ''
        }
      },
      artists: [],
      available_markets: [],
      disc_number: 0,
      duration_ms: 0,
      explicit: false,
      external_ids: {
        isrc: '',
        ean: '',
        upc: ''
      },
      external_urls: {
        spotify: ''
      },
      href: '',
      id: '',
      is_playable: false,
      linked_from: undefined,
      restrictions: {
        reason: ''
      },
      name: '',
      popularity: 0,
      preview_url: '',
      track_number: 0,
      type: '',
      uri: '',
      is_local: false
    },
    currently_playing_type: 'track',
    actions: {
      interrupting_playback: false,
      pausing: false,
      resuming: false,
      seeking: false,
      skipping_next: false,
      skipping_prev: false,
      toggling_repeat_context: false,
      toggle_shuffle: false,
      toggling_repeat_track: false,
      transferring_playback: false,
    }
  });


  constructor(private http: HttpClient) { }

  get_playback_state_subject(): Observable<PlaybackState> {
    return this.playbackState$;
  }

  refresh_playback_state(): void {
    console.log('refreshing playback state');
    // this.get_playback_state()
    this.http.get<PlaybackState>(`${this.baseUrl}/player`, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
      }).subscribe((playbackState: PlaybackState) => {
        this.playbackState$.next(playbackState);
      });
  }

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
    }).subscribe(() => {
      this.refresh_playback_state();
    });
  }

  pause(device_id?: string): void {
    this.http.put(`${this.baseUrl}/player/pause`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe(() => {
      this.refresh_playback_state();
    });
  }
  
  skip_to_next(): void {
    this.http.post(`${this.baseUrl}/player/next`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe(() => {
      this.refresh_playback_state();
    });
  }

  skip_to_previous(): void {
    this.http.post(`${this.baseUrl}/player/previous`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` }
    }).subscribe(() => {
      this.refresh_playback_state();
    });
  }

  seek_to_position(position_ms: number): void {
    this.http.put(`${this.baseUrl}/player/seek`, {}, {
      headers: { Authorization: `Bearer ${this.accessToken}` },
      params: { position_ms: position_ms }
    }).subscribe(() => {
      this.refresh_playback_state();
    });
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