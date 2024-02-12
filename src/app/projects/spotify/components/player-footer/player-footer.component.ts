import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { Observable, Subscription, map, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import { PlayerService } from '../../services/player.service';
import { TrackService } from '../../services/track.service';

import { PlaybackState } from '../../models/playback-state';
import { Device } from '../../models/device';
import { IconProvider } from '../../models/icon-provider';
import { WINDOW } from 'src/app/services/window';
import { Track } from '../../models/track';
import * as fromPlayerActions from '../../state/actions/player.actions';
import { Store } from '@ngrx/store';
import { SpotifyAppState } from '../../state';
import { selectIsFavorite, selectIsPlaying, selectPlayer, selectTrack } from '../../state/selectors/player.selectors';


@Component({
  selector: 'app-player-footer',
  templateUrl: './player-footer.component.html',
  styleUrls: ['./player-footer.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PlayerFooterComponent implements OnInit {
  accessToken = localStorage.getItem("accessToken");

  iconProvider = IconProvider;

  playIcon: string = IconProvider.play;
  favoriteIcon: string = IconProvider.unfavorited;
  // isFavorite: boolean = false;

  gray: string = 'rgb(178, 178, 178)';
  green: string = 'rgb(29, 185, 84)';

  favoriteIconColor: string = this.gray;
  shuffleIconColor: string = this.gray;
  repeatIconColor: string = this.gray;

  playbackState$!: Observable<PlaybackState>;
  isFavorite$!: Observable<boolean>;
  isPlaying$!: Observable<boolean>;
  track$!: Observable<Track>;
  devices: Device[] = [];

  timer: Observable<number> = timer(500, 1000);
  timerSubscription!: Subscription; 
  playbackTimerWidthPx: number = 0;

  lastVolumePercent: number = 0;

  constructor(
    private playerService: PlayerService,
    private trackService: TrackService,
    @Inject(WINDOW) private window: Window,
    // @Inject(DOCUMENT) private document: Document,
    private store: Store<SpotifyAppState>
  ) { }

  async ngOnInit(): Promise<void> {
    this.store.dispatch(fromPlayerActions.getPlayerFooter());
    this.playbackState$ = this.store.select(selectPlayer);

    this.track$ = this.store.select(selectTrack);
    this.isFavorite$ = this.store.select(selectIsFavorite);
    this.isPlaying$ = this.store.select(selectIsPlaying)

    this.track$.subscribe((track: Track) => {
      this.store.dispatch(fromPlayerActions.checkFavoriteTrackFooter());
    });

    this.playbackState$.subscribe((playbackState: PlaybackState) => {
      this.set_playback_width();
      playbackState.is_playing ? this.start_timer(): this.stop_timer();
    });

    this.isPlaying$.pipe(
      map((isPlaying: boolean) => isPlaying ? this.start_timer(): this.stop_timer())
    );
    // this.connect_to_player();

    await this.get_available_devices();
  }
  
  async get_available_devices() {
    this.playerService.get_available_devices()
    .subscribe((result: Device[])=>{
      let device_list: Device[] = [];
      let devices = Object.entries(result)[0][1];
      for (let i = 0; i < Object.entries(devices).length; i++) {
        let device = devices[`${i}` as keyof Device] as unknown as Device;
        device_list.push(device);
      }
      this.devices = device_list;
    })
  }
  
  toggle_play(playbackState: PlaybackState): void {
    playbackState.is_playing ? this.stop_timer(): this.start_timer();
    this.store.dispatch(fromPlayerActions.togglePlayFooter());
  }

  connect_to_player(): void {
    // console.log('connecting to player...');
    this.window.onSpotifyWebPlaybackSDKReady = () => {
      const player = new this.window.Spotify.Player({
        name: 'Web Playback SDK',
        getOAuthToken: (cb: (arg0: string | null) => void) => {
          cb(this.accessToken);
        },
        volume: 0.5
      });

      // if (!this.activeDevice) {
        console.log(`player ${player}`);
      // }

      player.addListener('ready', () => {
        console.log('Ready with Device ID');
      });

      player.addListener('not_ready', () => {
        console.log('Device ID has gone offline');
      });
      player.addListener('player_state_changed', () => {
        console.log('player state changed');
      })

      player.connect();
    }
  }
  
  skip_to_next(): void {
    this.store.dispatch(fromPlayerActions.skipNextFooter());
  }

  skip_to_previous(): void {
    this.store.dispatch(fromPlayerActions.skipPreviousFooter());
  }

  toggle_shuffle(shuffle_state: boolean): void {
    this.store.dispatch(fromPlayerActions.toggleShuffleFooter({ shuffle_state }));
  }

  toggle_repeat(repeat_state: string): void {
    this.store.dispatch(fromPlayerActions.toggleRepeatFooter({repeat_state}));
  }

  toggle_favorite(track: Track): void {
    this.store.dispatch(fromPlayerActions.toggleFavoriteTrackFooter());
  }

  set_playback_device(device: Device): void {
    this.store.dispatch(fromPlayerActions.setActiveDeviceFooter({device}));
  }

  toggle_mute(volume_percent: number): void {
    if (volume_percent > 0) {
      this.lastVolumePercent = volume_percent;
      this.store.dispatch(fromPlayerActions.setPlaybackVolumeFooter({volume_percent: 0}));
    } else {
      this.store.dispatch(fromPlayerActions.setPlaybackVolumeFooter({volume_percent: this.lastVolumePercent}));
    }
  }

  playback_clicked(playbackState: PlaybackState, event: MouseEvent): void {
    const element = document.getElementById('playback-slider');
    if (element) {
      const width = element.getBoundingClientRect().width;
      const new_position_ms = Math.round(playbackState.item.duration_ms * (event.offsetX / width));
      this.playbackTimerWidthPx = event.offsetX;
      this.store.dispatch(fromPlayerActions.setProgressMSFooter({ progress_ms: new_position_ms }));
    }
  }

  set_playback_width(): void {
    const element = document.getElementById('playback-slider');
    if (element) {
      this.playbackState$.subscribe((playbackState: PlaybackState) => {
        const width = element.getBoundingClientRect().width;
        const pixel_width = width * (playbackState.progress_ms / playbackState.item.duration_ms);
        this.playbackTimerWidthPx = pixel_width;
      })
    }
  }

  volume_clicked(event: MouseEvent): void {
    const element = document.getElementById('sound-slider');
    if (element) {
      let width = element.getBoundingClientRect().width;
      const new_volume_percent: number = Math.round(event.offsetX * 100 / width);
      this.store.dispatch(fromPlayerActions.setPlaybackVolumeFooter({volume_percent: new_volume_percent}));
    }
  }

  ms_to_min_sec(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = (`0${(Math.floor(ms / 1000) - (minutes * 60)).toString()}`).slice(-2);
    return `${minutes}:${seconds}`;
  }

  start_timer(): void {
    if (!this.timerSubscription || this.timerSubscription.closed) {
      this.timerSubscription = this.timer.subscribe(() => {
        this.store.dispatch(fromPlayerActions.incrementProgressMSFooter());
        // this.set_playback_width();
      })
    }
  }

  stop_timer(): void {
    this.timerSubscription.unsubscribe();
  }

  get_device_icons(device_type: string, size?: string): string[] {
    switch(device_type) {
      case 'Computer': {
        if (size == 'big') {
          return [this.iconProvider.bigComputer];
        } else {
          return [this.iconProvider.smallComputer]
        }
      }
      case 'Smartphone': {
        if (size == 'big') {
          return [this.iconProvider.bigPhoneOutside, this.iconProvider.bigPhoneInside];
        } else {
          return [this.iconProvider.smallPhoneOutside, this.iconProvider.smallPhoneInside];
        }
      }
      case 'TV': {
        if (size == 'big') {
          return [this.iconProvider.bigTV];
        } else {
          return [this.iconProvider.smallTV];
        }
      }
      default: {
        return [this.iconProvider.defaultSpeakerOutside, this.iconProvider.defaultSpeakerInside];
      }
    }
  }
}

