import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPlayer from '../reducers/player.reducer';

export const selectPlayerFeature = createFeatureSelector<fromPlayer.State>(
  fromPlayer.playerFeatureKey
);

export const selectPlayer = createSelector(
  selectPlayerFeature,
  (state: fromPlayer.State) => state.playbackState
);

export const selectTrack = createSelector(
  selectPlayerFeature,
  (state: fromPlayer.State) => state.playbackState.item
);

export const selectContext = createSelector(
  selectPlayerFeature,
  (state: fromPlayer.State) => state.playbackState.context
);

export const selectIsPlaying = createSelector(
  selectPlayerFeature,
  (state: fromPlayer.State) => state.playbackState.is_playing
);

export const selectIsFavorite = createSelector(
  selectPlayerFeature,
  (state: fromPlayer.State) => state.isFavorite
);
