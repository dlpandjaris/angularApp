import { Component, OnInit } from '@angular/core';
import { PlayerService } from '../../services/player.service';
import { PlaybackState } from '../../models/playback-state';

@Component({
  selector: 'app-player-footer',
  templateUrl: './player-footer.component.html',
  styleUrls: ['./player-footer.component.scss']
})
export class PlayerFooterComponent implements OnInit {

  accessToken = localStorage.getItem("accessToken");

  playIcon: string = 'fa-play';
  shuffleIconColor: string = 'rgb(178, 178, 178)';
  repeatIconColor: string = 'rgb(178, 178, 178)';

  playbackState!: PlaybackState;

  constructor(private playerService: PlayerService) { }

  async ngOnInit(): Promise<void> {
    await this.get_playback_state();
    console.log(this.playbackState);
  }

  async get_playback_state() {
    this.playerService.get_playback_state()
      .subscribe((result: PlaybackState)=>{
        this.playbackState = result;
        this.playbackState.is_playing ? this.playIcon = 'fa-pause': this.playIcon = 'fa-play';
        this.playbackState.shuffle_state ? this.shuffleIconColor = 'rgb(29, 185, 84)': this.shuffleIconColor = 'rgb(178, 178, 178)';
        this.playbackState.repeat_state == 'context' ? this.repeatIconColor = 'rgb(29, 185, 84)': this.repeatIconColor = 'rgb(178, 178, 178)';
      });
  }

  async play_clicked(): Promise<void> {
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

  shuffle(): void {
    console.log(`shuffle clicked: ${this.playbackState.shuffle_state}`);
    this.playbackState.shuffle_state ? this.playerService.shuffle(false): this.playerService.shuffle(true);
    this.playbackState.shuffle_state ? this.shuffleIconColor = 'rgb(178, 178, 178)': this.shuffleIconColor = 'rgb(29, 185, 84)';
    this.playbackState.shuffle_state = !this.playbackState.shuffle_state;

    console.log(this.playbackState.item)
  }

  repeat(): void {
    console.log(`repeat clicked: ${this.playbackState.repeat_state}`);
    this.playbackState.repeat_state == 'context' ? this.playerService.repeat('off'): this.playerService.repeat('context');
    this.playbackState.repeat_state == 'context' ? this.repeatIconColor = 'rgb(178, 178, 178)': this.repeatIconColor = 'rgb(29, 185, 84)';
    this.playbackState.repeat_state == 'context' ? this.playbackState.repeat_state = 'off': this.playbackState.repeat_state = 'context';
  }
}
