import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, concatMap } from 'rxjs/operators';
import { Observable, EMPTY, of } from 'rxjs';
import * as PlayerActions from '../actions/player.actions';
import { PlayerService } from '../../services/player.service';
import { PlaybackState } from '../../models/playback-state';


@Injectable()
export class PlayerEffects {

  getPlayers$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(PlayerActions.getPlayerFooter, PlayerActions.getPlayerTop),
      concatMap((action) =>
        this.playerService.get_playback_state().pipe(
          map((playbackState: PlaybackState) => PlayerActions.getPlayerSuccess({ playbackState: playbackState })),
          catchError((error) => of(PlayerActions.getPlayerFailure({ error })))
        )
      )
    );
  });


  constructor(
    private actions$: Actions,
    private playerService: PlayerService
  ) {}
}
