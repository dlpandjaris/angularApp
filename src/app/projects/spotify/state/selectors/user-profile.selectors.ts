import { createFeatureSelector, createSelector } from '@ngrx/store';
import { State, userProfileFeatureKey } from '../reducers/user-profile.reducer';

//Get feature from store
export const selectUserProfileFeature = createFeatureSelector<State>(
  userProfileFeatureKey
);

//Return user profile from feature
export const selectUserProfile = createSelector(
  selectUserProfileFeature,
  (state: State) => state.userProfile
);


//Pass multiple state features into one selector
// export interface UserProfileViewModel {
//   userProfile: UserProfile;
// }

// export const selectUserProfileViewModel = createSelector(
//   selectUserProfileFeature,
//   (state: State): UserProfileViewModel => {
//     return {
//       userProfile: state.userProfile
//     }
//   }
// );


// ng generate se state/selectors/user-profile --skip-tests=true