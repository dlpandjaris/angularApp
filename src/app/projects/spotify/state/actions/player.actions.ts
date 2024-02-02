import { createAction, props } from '@ngrx/store';
import { PlaybackState } from '../../models/playback-state';

// export const PlayerActions = createActionGroup({
//   source: 'Player',
//   events: {
//     'Get Players': emptyProps(),
//     'Get Players Success': props<{ data: unknown }>(),
//     'Get Players Failure': props<{ error: unknown }>(),
//   }
// });

export const getPlayerFooter = createAction('[Player Footer Component] Connect to Player');
export const getPlayerTop = createAction('[Top Component] Connect to Player');

export const getPlayerSuccess = createAction(
  '[Player Effect] Connect to Player Success', 
  props<{ playbackState: PlaybackState }>()
);

export const getPlayerFailure = createAction(
  '[Player Effect] Connect to Player Failure', 
  props<{ error: any }>()
);


// ng generate feature player --group=true --reducers=./index.ts --module=../components/spotify-layout/spotify-layout --api=true --skip-tests=true