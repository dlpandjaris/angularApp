import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
// import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { Observable, Subscription, timer } from 'rxjs';
import { DOCUMENT } from '@angular/common';

import { PlayerService } from '../../services/player.service';
import { TrackService } from '../../services/track.service';

import { PlaybackState } from '../../models/playback-state';
import { Device } from '../../models/device';
import { IconProvider } from '../../models/icon-provider';
import { WINDOW } from 'src/app/services/window';


declare let spotifyPlayer: any;

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
  isFavorite: boolean = false;

  gray: string = 'rgb(178, 178, 178)';
  green: string = 'rgb(29, 185, 84)';

  favoriteIconColor: string = this.gray;
  shuffleIconColor: string = this.gray;
  repeatIconColor: string = this.gray;

  playbackState!: PlaybackState;
  devices: Device[] = [];
  activeDevice!: Device;

  timer: Observable<number> = timer(500, 1000);
  timerSubscription!: Subscription; 
  playbackTimerWidthPx: number = 0;

  lastVolumePercent: number = 0;

  constructor(
    private playerService: PlayerService,
    private trackService: TrackService,
    @Inject(WINDOW) private window: Window,
    @Inject(DOCUMENT) private document: Document
    ) { }

  async ngOnInit(): Promise<void> {
    this.connect_to_player();
    await this.get_playback_state();
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
        if (device.is_active) {
          this.activeDevice = device;
        }
      }
      this.devices = device_list;
      // console.log(this.devices);
    })
  }
  
  check_favorite() {
    this.trackService.check_users_saved_tracks([this.playbackState.item.id])
    .subscribe((result: boolean[])=>{
      this.isFavorite = result[0];
      this.isFavorite ? this.favoriteIconColor = this.green: this.favoriteIconColor = this.gray;
      this.isFavorite ? this.favoriteIcon = IconProvider.favorited: this.favoriteIcon = IconProvider.unfavorited;
    })
  }
  
  async get_playback_state() {
    this.playerService.get_currently_playing_track()
    .subscribe((result: PlaybackState)=>{
      this.playbackState = result;
      this.playbackState.is_playing ? this.playIcon = IconProvider.pause: this.playIcon = IconProvider.play;
      this.playbackState.is_playing ? this.start_timer(): 0;
      this.playbackState.shuffle_state ? this.shuffleIconColor = this.green: this.shuffleIconColor = this.gray;
      this.playbackState.repeat_state == 'context' ? this.repeatIconColor = this.green: this.repeatIconColor = this.gray;
      this.check_favorite();
      this.set_playback_width();
    });
  }
  
  async toggle_play(): Promise<void> {
    this.playbackState.is_playing ? this.playerService.pause() : this.playerService.play();
    this.playbackState.is_playing ? this.stop_timer() : this.start_timer();
    this.playbackState.is_playing ? this.playIcon = IconProvider.play: this.playIcon = IconProvider.pause;
    this.playbackState.is_playing = !this.playbackState.is_playing;
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

      if (!this.activeDevice) {
        console.log(`player ${player}`);
        this.activeDevice = { // player;
          id: player.id,
          is_active: player.is_active,
          is_private_session: false,
          is_restricted: false,
          name: 'Web Playback SDK',
          type: player.type,
          volume_percent: player.volume_percent,
          supports_volume: player.supports_volume
        }
      }

      player.addListener('ready', () => {
        console.log('Ready with Device ID');
      });

      player.addListener('not_ready', () => {
        console.log('Device ID has gone offline');
      });
      player.addListener('player_state_changed', () => {
        this.get_playback_state();
        console.log('player state changed');
      })

      player.connect();

      console.log(`active device: ${this.activeDevice}`);
    }
  }
  
  skip_to_next(): void {
    this.playerService.skip_to_next();
    this.get_playback_state();
  }

  skip_to_previous(): void {
    this.playerService.skip_to_previous();
    this.get_playback_state();
  }

  toggle_shuffle(): void {
    this.playbackState.shuffle_state ? this.playerService.shuffle(false): this.playerService.shuffle(true);
    this.playbackState.shuffle_state ? this.shuffleIconColor = this.gray: this.shuffleIconColor = this.green;
    this.playbackState.shuffle_state = !this.playbackState.shuffle_state;
  }

  toggle_repeat(): void {
    this.playbackState.repeat_state == 'context' ? this.playerService.repeat('off'): this.playerService.repeat('context');
    this.playbackState.repeat_state == 'context' ? this.repeatIconColor = this.gray: this.repeatIconColor = this.green;
    this.playbackState.repeat_state == 'context' ? this.playbackState.repeat_state = 'off': this.playbackState.repeat_state = 'context';
  }

  toggle_favorite(): void {
    this.isFavorite ? this.trackService.remove_users_saved_tracks([this.playbackState.item.id]): this.trackService.save_tracks_for_current_user([this.playbackState.item.id]);
    this.isFavorite ? this.favoriteIconColor = this.gray: this.favoriteIconColor = this.green;
    this.isFavorite ? this.favoriteIcon = 'fa-regular': this.favoriteIcon = 'fa-solid';
    this.isFavorite = !this.isFavorite;
  }

  set_playback_device(device: Device): void {
    this.activeDevice = device;
    this.playerService.transfer_playback([device.id], this.playbackState.is_playing);
  }

  toggle_mute(): void {
    if (this.activeDevice.volume_percent > 0) {
      this.lastVolumePercent = this.activeDevice.volume_percent;
      this.activeDevice.volume_percent = 0;
    } else {
      this.activeDevice.volume_percent = this.lastVolumePercent;
    }
    this.playerService.set_playback_volume(this.activeDevice.volume_percent);
  }

  playback_clicked(event: MouseEvent): void {
    const element = document.getElementById('playback-slider');
    if (element) {
      const width = element.getBoundingClientRect().width;
      const new_position_ms = Math.round(this.playbackState.item.duration_ms * (event.offsetX / width));
      this.playbackTimerWidthPx = event.offsetX;
      this.playbackState.progress_ms = new_position_ms;
      this.playerService.seek_to_position(new_position_ms);
    }
  }

  set_playback_width(): void {
    const element = document.getElementById('playback-slider');
    if (element) {
      const width = element.getBoundingClientRect().width;
      const pixel_width = width * (this.playbackState.progress_ms / this.playbackState.item.duration_ms);
      this.playbackTimerWidthPx = pixel_width;
      // console.log(`${pixel_width} / ${width}`)
    }
  }

  volume_clicked(event: MouseEvent): void {
    const element = document.getElementById('sound-slider');
    if (element) {
      let width = element.getBoundingClientRect().width;
      this.activeDevice.volume_percent = Math.round(event.offsetX * 100 / width);
      this.playerService.set_playback_volume(this.activeDevice.volume_percent);
    }
  }

  ms_to_min_sec(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = (`0${(Math.floor(ms / 1000) - (minutes * 60)).toString()}`).slice(-2);
    return `${minutes}:${seconds}`;
  }

  start_timer(): void {
    this.timerSubscription = this.timer.subscribe(() => {
      if (this.playbackState.progress_ms >= this.playbackState.item.duration_ms - 1000) {
        this.stop_timer();
        this.get_playback_state();
      }
      this.playbackState.progress_ms = this.playbackState.progress_ms + 1000;
      this.set_playback_width();
    })
  }

  stop_timer(): void {
    this.timerSubscription.unsubscribe();
  }

  get_artist_list(): string {
    let artists = '';
    for (let artist of this.playbackState.item.artists) {
      artists = artists + artist.name + ', ';
    }
    return artists.slice(0, artists.length - 2);
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

