import { createAction, createActionGroup, emptyProps, props } from '@ngrx/store';
import { UserProfile } from '../../models/user-profile';

// export const UserProfileActions = createActionGroup({
//   source: 'Spotify Layout Component',
//   events: {
//     'Load UserProfile': emptyProps(),
//     'Load UserProfile Success': props<{ data: UserProfile }>(),
//     'Load UserProfile Failure': props<{ error: unknown }>(),
//   }
// });

export const getUserProfile = createAction('[Spotify Layout Component] Get User Profile');

export const getUserProfileSuccess = createAction(
  '[User Profile Effect] Get User Profile Success',
  props<{ userProfile: UserProfile }>()
);

export const getUserProfileFailure = createAction('[User Profile Effect] Get User Profile Faiure');

// ng g action actions/user-profile --api=true