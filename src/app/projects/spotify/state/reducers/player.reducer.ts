import { createFeature, createReducer, on } from '@ngrx/store';
import * as PlayerActions from '../actions/player.actions';
import { PlaybackState } from '../../models/playback-state';

export const playerFeatureKey = 'playerFeature';

const nullPlaybackState = {
  device: {
    id: '',
    is_active: false,
    is_private_session: false,
    is_restricted: false,
    name: '',
    type: '',
    volume_percent: 0,
    supports_volume: false
  },
  repeat_state: '',
  shuffle_state: false,
  context: {
    type: '',
    href: '',
    external_urls: {
      spotify: ''
    },
    uri: ''
  },
  timestamp: 0,
  progress_ms: 0,
  is_playing: false,
  item: {
    album: {
      album_type: '',
      total_tracks: '',
      available_markets: [],
      external_urls: {
        spotify: ''
      },
      href: '',
      id: '',
      images: [],
      name: '',
      release_date: '',
      release_date_precision: '',
      restrictions: {
        reason: ''
      },
      type: '',
      uri: '',
      copyrights: {
        text: '',
        type: ''
      },
      external_ids: {
        isrc: '',
        ean: '',
        upc: ''
      },
      genres: [],
      label: '',
      popularity: 0,
      album_group: '',
      artists: {
        external_urls: {
          spotify: ''
        },
        href: '',
        id: '',
        name: '',
        type: '',
        uri: ''
      }
    },
    artists: [],
    available_markets: [],
    disc_number: 0,
    duration_ms: 0,
    explicit: false,
    external_ids: {
      isrc: '',
      ean: '',
      upc: ''
    },
    external_urls: {
      spotify: ''
    },
    href: '',
    id: '',
    is_playable: false,
    linked_from: undefined,
    restrictions: {
      reason: ''
    },
    name: '',
    popularity: 0,
    preview_url: '',
    track_number: 0,
    type: '',
    uri: '',
    is_local: false
  },
  currently_playing_type: '',
  actions: {
    interrupting_playback: false,
    pausing: false,
    resuming: false,
    seeking: false,
    skipping_next: false,
    skipping_prev: false,
    toggling_repeat_context: false,
    toggle_shuffle: false,
    toggling_repeat_track: false,
    transferring_playback: false
  }
}

export interface State {
  playbackState: PlaybackState,
  error: any
}

export const initialState: State = {
  playbackState: nullPlaybackState,
  error: null
};

export const reducer = createReducer(
  initialState,
  on(PlayerActions.getPlayerSuccess, (state, action) => {
    return {
      ...state,
      playbackState: action.playbackState,
      error: null
    }
  }),
  on(PlayerActions.getPlayerFailure, (state, action) => {
    return {
      ...state,
      playbackState: nullPlaybackState,
      error: action.error
    }
  }),
  on(PlayerActions.toggleShuffleSuccess, (state, action) => {
    return {
      ...state,
      playbackState: {
        ...state.playbackState,
        shuffle_state: !action.shuffle
      }
    }
  }),
  on(PlayerActions.skipPreviousFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(PlayerActions.skipNextFailure, (state, action) => {
    return {
      ...state,
      error: action.error
    }
  }),
  on(PlayerActions.togglePlaySuccess, (state, action) => {
    console.log(action)
    return {
      ...state,
      playbackState: {
        ...state.playbackState,
        is_playing: action.is_playing
      }
    }
  })
);

export const playerFeature = createFeature({
  name: playerFeatureKey,
  reducer,
});

