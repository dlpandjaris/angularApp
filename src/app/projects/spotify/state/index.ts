import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { environment } from "src/environments/environment";
import * as fromUserProfile from './reducers/user-profile.reducer';
import * as fromPlayer from './reducers/player.reducer';
import { UserProfile } from "../models/user-profile";
import { PlaybackState } from "../models/playback-state";

// export const SpotifyAppFeatureKey = 'SpotifyApp'

export interface SpotifyAppState {
  [fromUserProfile.userProfileFeatureKey]: fromUserProfile.State;
  [fromPlayer.playerFeatureKey]: fromPlayer.State;
}

// export const reducers: ActionReducerMap<SpotifyAppState> = {
//   [fromUserProfile.userProfileFeatureKey]: fromUserProfile.reducer,
//   [fromPlayer.playerFeatureKey]: fromPlayer.reducer,
// }

// export const metaReducers: MetaReducer<SpotifyAppState>[] = !environment.production ? [] : [];