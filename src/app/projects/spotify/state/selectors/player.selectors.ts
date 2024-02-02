import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromPlayer from '../reducers/player.reducer';

export const selectPlayerFeature = createFeatureSelector<fromPlayer.State>(
  fromPlayer.playerFeatureKey
);

export const selectPlayer = createSelector(
  selectPlayerFeature,
  (state: fromPlayer.State) => state.playbackState
);