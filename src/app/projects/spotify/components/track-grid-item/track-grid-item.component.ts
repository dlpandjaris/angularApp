import { Component, ElementRef, Input } from '@angular/core';
import { IconProvider } from '../../models/icon-provider';
import { PlaybackState } from '../../models/playback-state';
import { Track } from '../../models/track';
import { SpotifyAppState } from '../../state';
import { Store } from '@ngrx/store';

import * as fromPlayerActions from '../../state/actions/player.actions';
import { TrackService } from '../../services/track.service';
import { PlayerService } from '../../services/player.service';
import { ToastService } from 'src/app/services/toast.service';
import { Observable } from 'rxjs';
import { selectPlayer } from '../../state/selectors/player.selectors';

@Component({
  selector: 'app-track-grid-item',
  templateUrl: './track-grid-item.component.html',
  styleUrl: './track-grid-item.component.scss'
})
export class TrackGridItemComponent {

  iconProvider = IconProvider;
  playbackState$!: Observable<PlaybackState>;

  @Input() track!: Track;
  @Input() rank!: number;
  @Input() isFavorite: boolean = false;

  constructor(
    private store: Store<SpotifyAppState>,
    private trackService: TrackService,
    private playerService: PlayerService,
    private toastService: ToastService,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.playbackState$ = this.store.select(selectPlayer);
  }

  toggle_play_track(track: Track): void {
    this.store.dispatch(fromPlayerActions.playTrackTop({ track: track }));
  }

  format_date(inputDate: string): string {
    const monthNames: string[] = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    
    const dateParts: string[] = inputDate.split('-');
    const monthAbbreviation: string = monthNames[parseInt(dateParts[1], 10) - 1];
    const day: string = parseInt(dateParts[2], 10).toString();
    const year: string = dateParts[0];

    return `${monthAbbreviation} ${day}, ${year}`;
  }

  toggle_favorite(rank: number) {
    this.isFavorite ? this.trackService.remove_users_saved_tracks([this.track.id]): this.trackService.save_tracks_for_current_user([this.track.id]);
    
    const event: CustomEvent = new CustomEvent('toggleFavoriteTrack', {
      bubbles: true,
      detail: rank
    });
    this.elementRef.nativeElement.dispatchEvent(event);
  }

  ms_to_min_sec(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = (`0${(Math.floor(ms / 1000) - (minutes * 60)).toString()}`).slice(-2);
    return `${minutes}:${seconds}`;
  }

  add_to_queue(track: Track): void {
    this.playerService.add_item_to_playback_queue(track.uri);
    this.toastService.show('spotify', `Added \"${track.name}\" to queue`);
  }
}
