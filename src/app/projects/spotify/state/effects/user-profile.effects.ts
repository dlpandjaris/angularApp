import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { UsersService } from '../../services/users.service';
import * as fromUserProfileActions from '../actions/user-profile.actions';
import { catchError, map, mergeMap, of } from 'rxjs';


@Injectable()
export class UserProfileEffects {

  getUserProfile$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromUserProfileActions.getUserProfile),
      mergeMap((action) =>
        this.usersService.getCurrentUsersProfile().pipe(
          map(data => fromUserProfileActions.getUserProfileSuccess({ userProfile: data })),
          catchError(error => of(fromUserProfileActions.getUserProfileFailure()))
        )
      ),
    );
  });

  constructor(
    private actions$: Actions,
    private usersService: UsersService
  ) {}
}
