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
    CommonModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true
  }],
  bootstrap: [SpotifyLayoutComponent]
})
export class SpotifyLayoutModule { }
