import { createReducer, on } from '@ngrx/store';
// import { getUserProfile, getUserProfileSuccess } from '../actions/user-profile.actions';
import * as fromUserProfileActions from '../actions/user-profile.actions'
import { UserProfile } from '../../models/user-profile';

export const userProfileFeatureKey = 'userProfileFeature';

export interface State {
  userProfile: UserProfile;
}

export const initialState: State = {
  userProfile: {
    country: '',
    display_name: '',
    email: '',
    explicit_content: {
      filter_enabled: false,
      filter_locked: false
    },
    external_urls: {
      spotify: ''
    },
    followers: {
      href: '',
      total: 0
    },
    href: '',
    id: '',
    images: [],
    product: '',
    type: '',
    uri: ''
  }
};

export const reducer = createReducer(
  initialState,
  on(fromUserProfileActions.getUserProfileSuccess, (state, action) => {
    return {
      ...state,
      userProfile: action.userProfile,
    }
  })
);

// ng generate reducer state/reducers/user-profile --api=true --reducers=../index.ts --skip-tests=true --module=components/spotify-layout/spotify-layout