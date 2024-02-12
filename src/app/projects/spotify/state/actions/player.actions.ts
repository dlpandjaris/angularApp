import { createAction, props } from '@ngrx/store';
import { PlaybackState } from '../../models/playback-state';
import { Device } from '../../models/device';
import { Track } from '../../models/track';
import { Artist } from '../../models/artist';
import { Playlist } from '../../models/playlist';

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

export const togglePlayFooter = createAction('[Player Footer Component] Toggle Play');
export const togglePlaySuccess = createAction(
  '[Player Effect] Toggle Play Success',
  props<{ is_playing: boolean }>()
);
export const togglePlayFailure = createAction(
  '[Player Effect] Toggle Play Failure',
  props<{ error: any }>()
);

export const playTrackTop = createAction(
  '[Top Component] Play Track',
  props<{ track: Track }>()
);
export const playTracksTop = createAction(
  '[Top Component] Play Tracks',
  props<{ tracks: Track[] }>()
);
export const playArtistTop = createAction(
  '[Top Component] Play Artist',
  props<{ artist: Artist }>()
)
export const playPlaylist = createAction(
  '[Playlist Component] Play Playlist',
  props<{ playlist: Playlist }>()
)
export const playTrackSuccess = createAction(
  '[Player Effect] Play Track Success',
  props<{ track: Track }>()
);
export const playArtistSuccuss = createAction('[Player Effect] Play Artist Success');
export const playPlaylistSuccess = createAction(
  '[Player Effect] Play Playlist Success',
  props<{ uri: string }>()
);
export const playTrackFailure = createAction(
  '[Player Effect] Play Track Failure',
  props<{ error: any }>()
);

export const toggleRepeatFooter = createAction(
  '[Player Footer Component] Toggle Repeat',
  props<{ repeat_state: string }>()
);
export const toggleRepeatSuccess = createAction(
  '[Player Effect] Toggle Repeat Success',
  props<{ repeat_state: string }>()
);
export const toggleRepeatFailure = createAction(
  '[Player Effect] Toggle Repeat Failure',
  props<{ error: any }>()
);

export const incrementProgressMSFooter = createAction('[Player Footer Component] Increment Progress MS');
export const incrementProgressMSSuccess = createAction('[Player Effect] Increment Progress MS Success');
export const incrementProgressMSFailure = createAction(
  '[Player Effect] Increment Progress MS Failure', 
  props<{ error: any }>()
);

export const setProgressMSFooter = createAction(
  '[Player Footer Component] Set Progress MS',
  props<{ progress_ms: number }>()
);
export const setProgressMSSuccess = createAction(
  '[Player Effect] Set Progress MS Success',
  props<{ progress_ms: number }>()
);
export const setProgressMSFailure = createAction(
  '[Player Effect] Set Progress MS Failure',
  props<{ error: any }>()
);

export const setActiveDeviceFooter = createAction(
  '[Player Footer Component] Set Active Device',
  props<{ device: Device }>()
);
export const setActiveDeviceSuccess = createAction(
  '[Player Effect] Set Active Device Success',
  props<{ device: Device }>()
);
export const setActiveDeviceFailure = createAction(
  '[Player Effect] Set Active Device Failure',
  props<{ error: any }>()
);

export const setPlaybackVolumeFooter = createAction(
  '[Player Footer Component] Set Playback Volume',
  props<{ volume_percent: number }>()
);
export const setPlaybackVolumeSuccess = createAction(
  '[Player Effect] Set Playback Volume Success',
  props<{ volume_percent: number }>()
);
export const setPlaybackVolumeFailure = createAction(
  '[Player Effect] Set Playback Volume Failure',
  props<{ error: any }>()
);

export const checkFavoriteTrackFooter = createAction('[Player Footer Component] Check Favorite Track');
export const checkFavoriteTrackSuccess = createAction(
  '[Player Effect] Check Favorite Track Success',
  props<{ is_favorite: boolean }>()
);
export const checkFavoriteTrackFailure = createAction(
  '[Player Effect] Check Favorite Track Failure',
  props<{ error: any }>()
);

export const toggleFavoriteTrackFooter = createAction('[Player Footer Component] Toggle Favorite Track');
export const toggleFavoriteTrackSuccess = createAction(
  '[Player Effect] Toggle Favorite Track Success',
  props<{ is_favorite: boolean }>()
);
export const toggleFavoriteTrackFailure = createAction(
  '[Player Effect] Toggle Favorite Track Failure',
  props<{ error: any }>()
);

export const resumePlaybackSuccess = createAction('[Player Effect] Resume Playback Success');
export const resumePlaybackFailure = createAction(
  '[Player Effect] Resume Playback Failure',
  props<{ error: any }>()
);

// ng generate feature player --group=true --reducers=./index.ts --module=../components/spotify-layout/spotify-layout --api=true --skip-tests=true