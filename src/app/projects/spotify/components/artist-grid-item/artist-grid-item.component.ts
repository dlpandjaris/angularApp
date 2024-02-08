import { Component, ElementRef, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PlaybackState } from '../../models/playback-state';
import { Artist } from '../../models/artist';
import { Store } from '@ngrx/store';
import { SpotifyAppState } from '../../state';
import { selectPlayer } from '../../state/selectors/player.selectors';
import * as fromPlayerActions from '../../state/actions/player.actions';
import { IconProvider } from '../../models/icon-provider';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-artist-grid-item',
  templateUrl: './artist-grid-item.component.html',
  styleUrl: './artist-grid-item.component.scss'
})
export class ArtistGridItemComponent {

  iconProvider = IconProvider;
  playbackState$!: Observable<PlaybackState>;

  @Input() artist!: Artist;
  @Input() rank!: number;
  @Input() isFollowing: boolean = false;

  constructor(
    private store: Store<SpotifyAppState>,
    private elementRef: ElementRef,
    private usersService: UsersService
  ) { }

  ngOnInit(): void {
    this.playbackState$ = this.store.select(selectPlayer);
  }

  toggle_play_artist(artist: Artist): void {
    this.store.dispatch(fromPlayerActions.playArtistTop({ artist: artist }));
  }

  toggle_follow(rank: number) {
    const event: CustomEvent = new CustomEvent('toggleFollowArtist', {
      bubbles: true,
      detail: rank
    });

    this.isFollowing ? 
    this.usersService.unfollowArtistsOrUsers('artist', this.artist.id).subscribe(() => {
      this.elementRef.nativeElement.dispatchEvent(event);
    }): 
    this.usersService.followArtistsOrUsers('artist', this.artist.id).subscribe(() => {
      this.elementRef.nativeElement.dispatchEvent(event);
    });
    
    this.elementRef.nativeElement.dispatchEvent(event);
  }
}
