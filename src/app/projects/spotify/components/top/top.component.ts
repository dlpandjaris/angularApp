import { HostListener, Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { TopTrackList } from '../../models/top-track-list';
import { TopArtistList } from '../../models/top-artist-list';
import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';

import { UsersService } from '../../services/users.service';
import { PlayerService } from '../../services/player.service';
import { TrackService } from '../../services/track.service';
import { PlaybackState } from '../../models/playback-state';
import { ToastService } from 'src/app/services/toast.service';
import { Store } from '@ngrx/store';
import * as fromPlayerActions from '../../state/actions/player.actions';

@Component({
  selector: 'app-top',
  templateUrl: './top.component.html',
  styleUrls: ['./top.component.scss']
})
export class TopComponent implements OnInit {

  playbackState$: Observable<PlaybackState>;
  isFavorite: boolean[] = [];

  iconProvider = IconProvider;

  term: string = "medium_term";
  sort_count: number = 0;
  sort_column: string = '';
  background_color: string = 'rgb(83, 83, 83)';
  
  top_tracks: Track[] = [];
  top_artists: Artist[] = [];
  user_profile!: UserProfile;

  accessToken = localStorage.getItem("accessToken");

  constructor(
    private usersService: UsersService,
    private playerService: PlayerService,
    private trackService: TrackService,
    private toastService: ToastService,
    private store: Store) { 
      this.playbackState$ = this.playerService.get_playback_state_subject();
    }

  async ngOnInit(): Promise<void> {
    this.store.dispatch(fromPlayerActions.getPlayerTop());

    await this.fetchTopTracks();
    await this.fetchTopArtists();
    await this.usersService.getCurrentUsersProfile()
    .subscribe((prof: UserProfile) => {
      this.user_profile = prof;
    })

    this.playerService.refresh_playback_state();
  }

  async fetchTopTracks() {
    this.usersService.getTopTracks(this.term)
      .subscribe((result: TopTrackList) => {
        this.top_tracks = result.items;
    })
  }

  sort_tracks(): {rank: number, track: Track}[] {
    let init_tracks: {rank: number, track: Track}[] = []
    this.top_tracks.forEach((track, index) => {
      init_tracks.push({rank: index, track: track});
    });

    switch (this.sort_count) {
      default: {
        return init_tracks;
      }
      case 1: {
        switch (this.sort_column) {
          default: {
            return init_tracks;
          }
          case 'title': {
            return init_tracks.sort((a, b) => a.track.name > b.track.name ? 1 : -1);
          }
          case 'album': {
            return init_tracks.sort((a, b) => a.track.album.name > b.track.album.name ? 1 : -1);
          }
          case 'release': {
            return init_tracks.sort((a, b) => a.track.album.release_date > b.track.album.release_date ? 1 : -1);
          }
          case 'duration': {
            return init_tracks.sort((a, b) => a.track.duration_ms > b.track.duration_ms ? 1 : -1);
          }
        }
      }
      case 2: {
        switch (this.sort_column) {
          default: {
            return init_tracks;
          }
          case 'title': {
            return init_tracks.sort((a, b) => a.track.name > b.track.name ? -1 : 1);
          }
          case 'album': {
            return init_tracks.sort((a, b) => a.track.album.name > b.track.album.name ? -1 : 1);
          }
          case 'release': {
            return init_tracks.sort((a, b) => a.track.album.release_date > b.track.album.release_date ? -1 : 1);
          }
          case 'duration': {
            return init_tracks.sort((a, b) => a.track.duration_ms > b.track.duration_ms ? -1 : 1);
          }
        }
      }
    }
  }

  toggle_sort(sort_column: string): void {
    this.sort_column == sort_column ? (
      this.sort_count >= 2 ? this.sort_count = 0 : this.sort_count = this.sort_count + 1
    ): (
      this.sort_column = sort_column,
      this.sort_count = 1
    )
    console.log(this.sort_column, this.sort_count);
  }

  async fetchTopArtists() {
    this.usersService.getTopArtists(this.term)
      .subscribe((result: TopArtistList) => {
        this.top_artists = result.items;
        this.checkFavorites();
    })
  }

  async checkFavorites() {
    let ids: string = '';
    for (let track of this.top_tracks) {
      ids = ids + track.id + ',';
    }
    ids = ids.slice(0, ids.length - 1);

    this.trackService.check_users_saved_tracks(ids)
    .subscribe((result: boolean[])=>{
      this.isFavorite = result;
    })
  }


  setTerm(term: string) {
    if (term != this.term) {
      this.term = term;
      this.sort_count = 0;
      this.fetchTopTracks();
    }


    this.set_background_color();
  }

  toggle_play_track(track: Track): void {
    console.log(`Clicked: ${track.name}`);
    this.playbackState$.subscribe((playbackState: PlaybackState) => {
      if (playbackState.is_playing && playbackState.item.uri == track.uri) {
        this.playerService.pause();
      } else {
        // this.playerService.pause();
        this.playerService.play(undefined, [track.uri]);
      }
    });
  }

  toggle_play(): void {

  }

  add_to_queue(track: Track): void {
    this.playerService.add_item_to_playback_queue(track.uri);
    this.toastService.show('spotify', `Added \"${track.name}\" to queue`);
    // console.log('added to queue');
  }

  ms_to_hour_min(ms: number): string[] {
    const hours = Math.floor(ms / (1000 * 60 * 60))
    const minutes = (`0${(Math.floor(ms / (1000 * 60)) - (hours * 60)).toString()}`).slice(-2);
    return [hours.toString(), minutes];
  }

  ms_to_min_sec(ms: number): string {
    const minutes = Math.floor(ms / (1000 * 60));
    const seconds = (`0${(Math.floor(ms / 1000) - (minutes * 60)).toString()}`).slice(-2);
    return `${minutes}:${seconds}`;
  }

  get_total_duration(): string {
    let total_ms: number = 0;
    for (let track of this.top_tracks) {
      total_ms = total_ms + track.duration_ms;
    }
    const hour_min = this.ms_to_hour_min(total_ms);
    // console.log(total_ms, hour_min);
    return `${hour_min[0]} hr ${hour_min[1]} min`;
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

  toggle_favorite(index: number): void {
    this.isFavorite[index] ? this.trackService.remove_users_saved_tracks([this.top_tracks[index].id]): this.trackService.save_tracks_for_current_user([this.top_tracks[index].id]);
    this.isFavorite[index] = !this.isFavorite[index];
  }  

  set_background_color() {
    const coverImage = document.getElementById('coverImage') as HTMLImageElement;
    coverImage.setAttribute('crossOrigin', '');

    const canvas = document.createElement('canvas');
    canvas.width = coverImage.clientWidth;
    canvas.height = coverImage.clientHeight;
    
    const context = canvas.getContext('2d');
    context?.drawImage(coverImage, 0, 0);
    
    const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);

    if (imageData) {
      const imageRGB = this.buildRGB(imageData.data);

      // console.log(this.findBiggestColorRange(imageRGB));
      const initialPalette = this.quantization(imageRGB, 0);
      const color = this.orderByLuminance(initialPalette)[0];
      this.background_color = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    }
  }

  buildRGB(imageData: Uint8ClampedArray): number[][] {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
      // const rgb = {
      //   r: imageData[i],
      //   g: imageData[i + 1],
      //   b: imageData[i + 2],
      // };
      // rgbValues.push(rgb);

      rgbValues.push([
        imageData[i], imageData[i+1], imageData[i+2]
      ]);
    }
    return rgbValues;
  };

  findBiggestColorRange(
    rgbValues: number[][]
  ): number {

    let rMin = Number.MAX_VALUE;
    let gMin = Number.MAX_VALUE;
    let bMin = Number.MAX_VALUE;
  
    let rMax = Number.MIN_VALUE;
    let gMax = Number.MIN_VALUE;
    let bMax = Number.MIN_VALUE;
  
    rgbValues.forEach((pixel) => {
      rMin = Math.min(rMin, pixel[0]);
      gMin = Math.min(gMin, pixel[1]);
      bMin = Math.min(bMin, pixel[2]);
  
      rMax = Math.max(rMax, pixel[0]);
      gMax = Math.max(gMax, pixel[1]);
      bMax = Math.max(bMax, pixel[2]);
    });
  
    const rRange = rMax - rMin;
    const gRange = gMax - gMin;
    const bRange = bMax - bMin;
  
    const biggestRange = Math.max(rRange, gRange, bRange);
    if (biggestRange === rRange) {
      return 0;
    } else if (biggestRange === gRange) {
      return 1;
    } else {
      return 2;
    }
  };

  quantization(rgbValues: number[][], depth: number): number[][] {
    const MAX_DEPTH = 2;
    if (depth === MAX_DEPTH || rgbValues.length === 0) {
      const color = rgbValues.reduce(
        (prev: number[], curr: number[]) => {
          prev[0] += curr[0];
          prev[1] += curr[1];
          prev[2] += curr[2];

          return prev;
        }
      );
      color[0] = Math.round(color[0] / rgbValues.length);
      color[1] = Math.round(color[1] / rgbValues.length);
      color[2] = Math.round(color[2] / rgbValues.length);
      return [color];
    }

    const componentToSortBy: number = this.findBiggestColorRange(rgbValues);
    rgbValues.sort((a, b) => a[componentToSortBy] > b[componentToSortBy] ? 1 : -1);
  
    const mid = rgbValues.length / 2;
    return [
      ...this.quantization(rgbValues.slice(0, mid), depth + 1),
      ...this.quantization(rgbValues.slice(mid + 1), depth + 1),
    ];
  }

  calculateLuminance(p: number[]): number {
    return 0.2126 * p[0] + 0.7152 * p[1] + 0.0722 * p[2];
  };

  orderByLuminance(rgbValues: number[][]): number[][] {
    return rgbValues.sort((p1, p2) => {
      return this.calculateLuminance(p2) - this.calculateLuminance(p1);
    });
  };
  
  

  // @HostListener('window:scroll', [])
  // onWindowScroll() {
  //   const scrollOffset = document.documentElement.scrollTop || document.body.scrollTop || 0;

  //   if (scrollOffset >= 120) {
  //     document.querySelectorAll('.controllable').forEach((c) => {
  //       c.classList.add('text-smaller');
  //       c.classList.remove('text-larger');
  //     });
  //   } else {
  //     document.querySelectorAll('.controllable').forEach((c) => {
  //       c.classList.add('text-larger');
  //       c.classList.remove('text-smaller');
  //     });
  //   }
  // }
}
