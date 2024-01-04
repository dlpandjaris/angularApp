import { Component, OnInit } from '@angular/core';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';

import { PlayerService } from '../../services/player.service';
import { TrackService } from '../../services/track.service';

import { PlaybackState } from '../../models/playback-state';
import { Device } from '../../models/device';
import { IconProvider } from '../../models/icon-provider';


@Component({
  selector: 'app-player-footer',
  templateUrl: './player-footer.component.html',
  styleUrls: ['./player-footer.component.scss']
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

  lastVolumePercent: number = 0;

  constructor(
    private playerService: PlayerService,
    private trackService: TrackService) { }

  async ngOnInit(): Promise<void> {
    await this.get_playback_state();
    await this.get_available_devices();
  }
  
  async get_available_devices() {
    this.playerService.get_available_devices()
    .subscribe((result: Device[])=>{
      this.devices = result;
      this.get_active_device();
    })
  }
  
  get_active_device() {
    let devices = Object.entries(this.devices)[0][1]
    for (let i = 0; i < Object.entries(devices).length; i++) {
      let device = devices[`${i}` as keyof Device] as unknown as Device;
      if (device.is_active) {
        this.activeDevice = device;
      }
    }
  }
  
  check_favorite() {
    this.trackService.check_users_saved_tracks([this.playbackState.item.id])
    .subscribe((result: boolean[])=>{
      this.isFavorite = result[0];
      this.isFavorite ? this.favoriteIconColor = this.green: this.favoriteIconColor = this.gray;
      this.isFavorite ? this.favoriteIcon = IconProvider.favorited: this.favoriteIcon = IconProvider.unfavorited;
      // console.log(`Favorited?: ${result}`);
    })
  }
  
  async get_playback_state() {
    this.playerService.get_currently_playing_track()
    .subscribe((result: PlaybackState)=>{
      this.playbackState = result;
      this.playbackState.is_playing ? this.playIcon = IconProvider.pause: this.playIcon = IconProvider.play;
      this.playbackState.shuffle_state ? this.shuffleIconColor = this.green: this.shuffleIconColor = this.gray;
      this.playbackState.repeat_state == 'context' ? this.repeatIconColor = this.green: this.repeatIconColor = this.gray;
      this.check_favorite();
    });
  }
  
  async toggle_play(): Promise<void> {
    console.log(`play clicked: ${this.playbackState.is_playing}`);
    this.playbackState.is_playing ? this.playerService.pause() : this.playerService.play();
    this.playbackState.is_playing ? this.playIcon = IconProvider.play: this.playIcon = IconProvider.pause;
    this.playbackState.is_playing = !this.playbackState.is_playing;
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
    console.log(`shuffle clicked: ${this.playbackState.shuffle_state}`);
    this.playbackState.shuffle_state ? this.playerService.shuffle(false): this.playerService.shuffle(true);
    this.playbackState.shuffle_state ? this.shuffleIconColor = this.gray: this.shuffleIconColor = this.green;
    this.playbackState.shuffle_state = !this.playbackState.shuffle_state;

    console.log(this.devices);
    console.log(this.activeDevice.volume_percent);
  }

  toggle_repeat(): void {
    console.log(`repeat clicked: ${this.playbackState.repeat_state}`);
    this.playbackState.repeat_state == 'context' ? this.playerService.repeat('off'): this.playerService.repeat('context');
    this.playbackState.repeat_state == 'context' ? this.repeatIconColor = this.gray: this.repeatIconColor = this.green;
    this.playbackState.repeat_state == 'context' ? this.playbackState.repeat_state = 'off': this.playbackState.repeat_state = 'context';
  }

  toggle_favorite(): void {
    console.log(`favorite clicked: ${this.isFavorite}`);
    this.isFavorite ? this.trackService.remove_users_saved_tracks([this.playbackState.item.id]): this.trackService.save_tracks_for_current_user([this.playbackState.item.id]);
    this.isFavorite ? this.favoriteIconColor = this.gray: this.favoriteIconColor = this.green;
    this.isFavorite ? this.favoriteIcon = 'fa-regular': this.favoriteIcon = 'fa-solid';
    this.isFavorite = !this.isFavorite;
  }

  toggle_mute(): void {
    console.log(`mute clicked: ${this.activeDevice.volume_percent}`);
    if (this.activeDevice.volume_percent > 0) {
      this.lastVolumePercent = this.activeDevice.volume_percent;
      this.activeDevice.volume_percent = 0;
    } else {
      this.activeDevice.volume_percent = this.lastVolumePercent;
    }
    this.playerService.set_playback_volume(this.activeDevice.volume_percent);
  }

  volume_drag_move(event: CdkDragMove): void {
  }

  volume_drag_end(event: CdkDragEnd): void {
    const element = document.getElementById('audio-progress')
    if (element) {
      let width = element.getBoundingClientRect().width;
      this.activeDevice.volume_percent = this.activeDevice.volume_percent + Math.round(event.distance.x * 100 / width);
      console.log(this.activeDevice.volume_percent);
      this.playerService.set_playback_volume(this.activeDevice.volume_percent);
    }
  }

  volume_clicked(event: MouseEvent): void {
    // console.log(event.x);
    // console.log(event.)
    // console.log(event.offsetX);
    // this.activeDevice.volume_percent = event.offsetX;
    // this.playerService.set_playback_volume(this.activeDevice.volume_percent);
    // this.set_volume_icon();
  }
}

