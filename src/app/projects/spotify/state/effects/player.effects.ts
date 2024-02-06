import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap, mergeMap, delay } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as PlayerActions from '../actions/player.actions';
import { PlayerService } from '../../services/player.service';
import { PlaybackState } from '../../models/playback-state';


@Injectable()
export class PlayerEffects {

  getPlayers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(
        PlayerActions.getPlayerFooter, 
        PlayerActions.getPlayerTop, 
        PlayerActions.skipPreviousSuccess,
        PlayerActions.skipNextSuccess),
      mergeMap((action) =>
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
      concatMap((action) => {
        if (action.is_playing) {
          return this.playerService.pause().pipe(
            map(() => PlayerActions.togglePlaySuccess({ is_playing: !action.is_playing })),
            catchError((error) => of(PlayerActions.togglePlayFailure({ error })))
          );
        } else {
          return this.playerService.play().pipe(
            map(() => PlayerActions.togglePlaySuccess({ is_playing: !action.is_playing })),
            catchError((error) => of(PlayerActions.togglePlayFailure({ error })))
          );
        }
      }
    ));
  });


  constructor(
    private actions$: Actions,
    private playerService: PlayerService
  ) {}
}
