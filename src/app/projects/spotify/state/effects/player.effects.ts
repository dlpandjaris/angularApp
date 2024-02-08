import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, delay, tap, withLatestFrom, switchMap, exhaustMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as PlayerActions from '../actions/player.actions';
import { PlayerService } from '../../services/player.service';
import { PlaybackState } from '../../models/playback-state';
import { Store } from '@ngrx/store';
import { SpotifyAppState } from '..';
import { selectPlayer } from '../selectors/player.selectors';


@Injectable()
export class PlayerEffects {

  getPlayers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PlayerActions.getPlayerFooter, 
        PlayerActions.getPlayerTop, 
        PlayerActions.skipPreviousSuccess,
        PlayerActions.skipNextSuccess,
        PlayerActions.incrementProgressMSFailure,
        PlayerActions.playTrackSuccess,
        PlayerActions.playArtistSuccuss,
        PlayerActions.playPlaylistSuccess),
      concatMap((action) =>
        this.playerService.get_playback_state().pipe(
          map((playbackState: PlaybackState) => PlayerActions.getPlayerSuccess({ playbackState: playbackState })),
          catchError((error) => of(PlayerActions.getPlayerFailure({ error })))
        )
      )
    );
  });

  shufflePlaybackState$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.toggleShuffleFooter),
      concatMap((action) =>
        this.playerService.shuffle(!action.shuffle_state).pipe(
          map(() => PlayerActions.toggleShuffleSuccess({ shuffle: action.shuffle_state })),
          catchError((error) => of(PlayerActions.toggleShuffleFailure({ error })))
        )
      )
    );
  });

  skipToPrevious$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.skipPreviousFooter),
      concatMap((action) =>
        this.playerService.skip_to_previous().pipe(
          delay(1000),
          map(() => PlayerActions.skipNextSuccess()),
          catchError((error) => of(PlayerActions.skipNextFailure({ error })))
        )
      )
    );
  });

  skipToNext$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.skipNextFooter),
      concatMap((action) =>
        this.playerService.skip_to_next().pipe(
          delay(1000),
          map(() => PlayerActions.skipNextSuccess()),
          catchError((error) => of(PlayerActions.skipNextFailure({ error })))
        )
      )
    );
  });

  togglePlay$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.togglePlayFooter),
      withLatestFrom(this.store.select(selectPlayer)),
      concatMap(([action, playbackState]) => {
        if (playbackState.is_playing) {
          return this.playerService.pause().pipe(
            map(() => PlayerActions.togglePlaySuccess({ is_playing: false })),
            catchError((error) => of(PlayerActions.togglePlayFailure({ error })))
          );
        } else {
          return this.playerService.play(playbackState.device.id, [playbackState.item.uri], playbackState.progress_ms).pipe(
            map(() => PlayerActions.togglePlaySuccess({ is_playing: true })),
            catchError((error) => of(PlayerActions.togglePlayFailure({ error })))
          );
        }
      }
    ));
  });

  playTrack$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.playTrackTop),
      withLatestFrom(this.store.select(selectPlayer)),
      concatMap(([action, playbackState]) => {
        if (playbackState.item.id == action.track.id) {
          if (playbackState.is_playing) {
            return this.playerService.pause().pipe(
              map(() => PlayerActions.playTrackSuccess({ track: action.track })),
              catchError((error) => of(PlayerActions.playTrackFailure({ error })))
            );
          } else {
              return this.playerService.play(playbackState.device.id, [action.track.uri], playbackState.progress_ms).pipe(
                delay(1000),
                map(() => PlayerActions.playTrackSuccess({ track: action.track })),
                catchError((error) => of(PlayerActions.playTrackFailure({ error })))
              );
          }
        } else {
          return this.playerService.play(playbackState.device.id, [action.track.uri]).pipe(
            delay(1000),
            map(() => PlayerActions.playTrackSuccess({ track: action.track })),
            catchError((error) => of(PlayerActions.playTrackFailure({ error })))
          );
        }
      }
    ));
  });

  playTracks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.playTracksTop),
      withLatestFrom(this.store.select(selectPlayer)),
      concatMap(([action, playbackState]) => {
        let ids: string[] = [];
        for (let track of action.tracks) {
          ids.push(track.id);
        }

        return this.playerService.play(playbackState.device.id, ids).pipe(
          delay(1000),
          map(() => PlayerActions.playTrackSuccess({ track: action.tracks[0] })),
          catchError((error) => of(PlayerActions.playTrackFailure({ error })))
        );
      })
    )
  })

  playArtist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.playArtistTop),
      withLatestFrom(this.store.select(selectPlayer)),
      concatMap(([action, playbackState]) => {
        return this.playerService.play_artist(playbackState.device.id, action.artist.uri).pipe(
          delay(1000),
          map(() => PlayerActions.playPlaylistSuccess({ uri: action.artist.uri })),
          catchError((error) => of(PlayerActions.playTrackFailure({ error })))
        );
      })
    )
  })

  playPlaylist$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.playPlaylist),
      withLatestFrom(this.store.select(selectPlayer)),
      concatMap(([action, playbackState]) => {
        return this.playerService.play_artist(playbackState.device.id, action.playlist.uri).pipe(
          delay(1000),
          map(() => PlayerActions.playPlaylistSuccess({ uri: action.playlist.uri })),
          catchError((error) => of(PlayerActions.playTrackFailure({ error })))
        );
      })
    )
  })

  toggleRepeat$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.toggleRepeatFooter),
      concatMap((action) => {
        let next_repeat_state: string = '';
        action.repeat_state == 'off' ? next_repeat_state = 'context': 
          action.repeat_state == 'context' ? next_repeat_state = 'track': next_repeat_state = 'off';
        return this.playerService.repeat(next_repeat_state).pipe(
          map(() => PlayerActions.toggleRepeatSuccess({ repeat_state: next_repeat_state })),
          catchError((error) => of(PlayerActions.toggleRepeatFailure({ error })))
        );
      }
    ));
  });

  incrementProgressMS$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.incrementProgressMSFooter),
      withLatestFrom(this.store.select(selectPlayer)),
      map(([action, playbackState]) => {
        if (playbackState.progress_ms >= playbackState.item.duration_ms - 1000) {
          return PlayerActions.incrementProgressMSFailure({ error: 'track finished' });
        } else {
          return PlayerActions.incrementProgressMSSuccess();
        }
      })
    )
  });

  setProgressMS$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.setProgressMSFooter),
      concatMap((action) => {
        return this.playerService.seek_to_position(action.progress_ms).pipe(
          map(() => PlayerActions.setProgressMSSuccess({ progress_ms: action.progress_ms })),
          catchError((error) => of(PlayerActions.setProgressMSFailure({ error })))
        );
      }
    ));
  });

  setActiveDevice$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.setActiveDeviceFooter),
      withLatestFrom(this.store.select(selectPlayer)),
      concatMap(([action, playbackState]) => {
        return this.playerService.transfer_playback([action.device.id], playbackState.is_playing).pipe(
          map(() => PlayerActions.setActiveDeviceSuccess({ device: action.device })),
          catchError((error) => of(PlayerActions.setActiveDeviceFailure({ error })))
        );
      }
    ));
  });

  setPlaybackVolume$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.setPlaybackVolumeFooter),
      concatMap((action) => {
        return this.playerService.set_playback_volume(action.volume_percent).pipe(
          map(() => PlayerActions.setPlaybackVolumeSuccess({ volume_percent: action.volume_percent })),
          catchError((error) => of(PlayerActions.setPlaybackVolumeFailure({ error })))
        );
      }
    ));
  });


  constructor(
    private actions$: Actions,
    private playerService: PlayerService,
    private store: Store<SpotifyAppState>
  ) {}
}
