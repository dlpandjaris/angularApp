import { Component, OnInit } from '@angular/core';

import { PlayerService } from '../../services/player.service';
import { PlaylistService } from '../../services/playlist.service';
import { TrackService } from '../../services/track.service';

import { PlaybackState } from '../../models/playback-state';
import { Device } from '../../models/device';

@Component({
  selector: 'app-player-footer',
  templateUrl: './player-footer.component.html',
  styleUrls: ['./player-footer.component.scss']
})
export class PlayerFooterComponent implements OnInit {

  accessToken = localStorage.getItem("accessToken");

  playIcon: string = 'fa-play';
  favoriteIcon: string = 'fa-regular';
  is_favorite: boolean = false;

  favoriteIconColor: string = 'rgb(178, 178, 178)';
  shuffleIconColor: string = 'rgb(178, 178, 178)';
  repeatIconColor: string = 'rgb(178, 178, 178)';

  playbackState!: PlaybackState;
  devices: Device[] = [];

  constructor(
    private playerService: PlayerService,
    private playlistService: PlaylistService,
    private trackService: TrackService) { }

  async ngOnInit(): Promise<void> {
    await this.get_playback_state();
    await this.check_favorite();

    // console.log(this.playbackState);

    if (!this.playbackState) {
      console.log('playbackState == null');
      await this.get_available_devices();

      console.log('devices')
      this.devices.forEach(device => {
        console.log(device);
      });
    }
  }

  async get_available_devices() {
    this.playerService.get_available_devices()
      .subscribe((result: Device[])=>{
        this.devices = result;
        // console.log(result);
      })
  }

  async check_favorite() {
    this.trackService.check_users_saved_tracks([this.playbackState.item.id])
      .subscribe((result: boolean[])=>{
        this.is_favorite = result[0];
        console.log(`Favorited?: ${result}`);
      })
  }

  async get_playback_state() {
    this.playerService.get_currently_playing_track()
      .subscribe((result: PlaybackState)=>{
        this.playbackState = result;
        this.playbackState.is_playing ? this.playIcon = 'fa-pause': this.playIcon = 'fa-play';
        this.playbackState.shuffle_state ? this.shuffleIconColor = 'rgb(29, 185, 84)': this.shuffleIconColor = 'rgb(178, 178, 178)';
        this.playbackState.repeat_state == 'context' ? this.repeatIconColor = 'rgb(29, 185, 84)': this.repeatIconColor = 'rgb(178, 178, 178)';
      });
  }

  async toggle_play(): Promise<void> {
    console.log(`play clicked: ${this.playbackState.is_playing}`);
    this.playbackState.is_playing ? this.playerService.pause() : this.playerService.play();
    this.playbackState.is_playing ? this.playIcon = 'fa-play': this.playIcon = 'fa-pause';
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
    this.playbackState.shuffle_state ? this.shuffleIconColor = 'rgb(178, 178, 178)': this.shuffleIconColor = 'rgb(29, 185, 84)';
    this.playbackState.shuffle_state = !this.playbackState.shuffle_state;

    console.log(this.playbackState.item);
    this.check_favorite();
  }

  toggle_repeat(): void {
    console.log(`repeat clicked: ${this.playbackState.repeat_state}`);
    this.playbackState.repeat_state == 'context' ? this.playerService.repeat('off'): this.playerService.repeat('context');
    this.playbackState.repeat_state == 'context' ? this.repeatIconColor = 'rgb(178, 178, 178)': this.repeatIconColor = 'rgb(29, 185, 84)';
    this.playbackState.repeat_state == 'context' ? this.playbackState.repeat_state = 'off': this.playbackState.repeat_state = 'context';
  }

  toggle_favorite(): void {
    console.log(`favorite clicked: ${this.is_favorite}`);
    this.is_favorite ? this.trackService.remove_users_saved_tracks([this.playbackState.item.id]): this.trackService.save_tracks_for_current_user([this.playbackState.item.id]);
    this.is_favorite ? this.favoriteIconColor = 'rgb(178, 178, 178)': this.favoriteIconColor = 'rgb(29, 185, 84)';
    this.is_favorite ? this.favoriteIcon = 'fa-regular': this.favoriteIcon = 'fa-solid';
    this.is_favorite = !this.is_favorite;
  }
}
