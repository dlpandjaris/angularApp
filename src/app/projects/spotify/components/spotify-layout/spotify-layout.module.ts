import { NgModule } from '@angular/core';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SpotifyLayoutRoutingModule } from './spotify-layout-routing.module';
import { SpotifyLayoutComponent } from './spotify-layout.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SpotifyComponent } from '../spotify/spotify.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { TopComponent } from '../top/top.component';
import { PlayerFooterComponent } from '../player-footer/player-footer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TokenInterceptor } from 'src/app/interceptors/token.interceptor';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../../services/player.service';
import { UserProfileEffects } from '../../state/effects/user-profile.effects';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import * as fromUserProfile from '../../state/reducers/user-profile.reducer';
import * as fromPlayer from '../../state/reducers/player.reducer';
import { PlayerEffects } from '../../state/effects/player.effects';
import { SpotifyAppFeatureKey, reducers } from '../../state';

@NgModule({
  declarations: [
    SpotifyLayoutComponent,
    SpotifyComponent,
    NavbarComponent,
    TopComponent,
    NavbarComponent,
    PlayerFooterComponent
  ],
  imports: [
    SpotifyLayoutRoutingModule,
    NgbModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    DragDropModule,
    CommonModule,
    EffectsModule.forFeature([
      UserProfileEffects,
      PlayerEffects
    ]),
    StoreModule.forFeature(SpotifyAppFeatureKey, reducers)
    // StoreModule.forFeature(fromPlayer.playerFeatureKey, fromPlayer.reducer),
  ],
  providers: [
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    },
    PlayerService],
  bootstrap: [SpotifyLayoutComponent]
})
export class SpotifyLayoutModule { }
