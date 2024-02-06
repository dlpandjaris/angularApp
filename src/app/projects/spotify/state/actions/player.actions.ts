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

export const toggleShuffleFooter = createAction(
  '[Player Footer Component] Toggle Shuffle',
  props<{ shuffle_state: boolean }>()
);
export const toggleShuffleSuccess = createAction(
  '[Player Effect] Toggle Shuffle Success',
  props<{ shuffle: boolean }>()
);
export const toggleShuffleFailure = createAction(
  '[Player Effect] Toggle Shuffle Failure',
  props<{ error: any }>()
);

export const skipPreviousFooter = createAction('[Player Footer Component] Skip to Previous Track');
export const skipPreviousSuccess = createAction('[Player Effect] Skip to Previous Track Success');
export const skipPreviousFailure = createAction(
  '[Player Effect] Skip to Previous Track Failure',
  props<{ error: any }>()
);

export const skipNextFooter = createAction('[Player Footer Component] Skip to Next Track');
export const skipNextSuccess = createAction('[Player Effect] Skip to Next Track Success');
export const skipNextFailure = createAction(
  '[Player Effect] Skip to Next Track Failure',
  props<{ error: any }>()
);

export const togglePlayFooter = createAction(
  '[Player Footer Component] Toggle Play',
  props<{ is_playing: boolean }>()
);
export const togglePlaySuccess = createAction(
  '[Player Effect] Toggle Play Success',
  props<{ is_playing: boolean }>()
);
export const togglePlayFailure = createAction(
  '[Player Effect] Toggle Play Failure',
  props<{ error: any }>()
);

// ng generate feature player --group=true --reducers=./index.ts --module=../components/spotify-layout/spotify-layout --api=true --skip-tests=true