import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpotifyComponent } from '../spotify/spotify.component';
import { TopTracksComponent } from '../top-tracks/top-tracks.component';
import { SpotifyLayoutComponent } from '../spotify-layout/spotify-layout.component';
import { TopArtistsComponent } from '../top-artists/top-artists.component';
import { PlaylistListComponent } from '../playlist-list/playlist-list.component';
import { PlaylistComponent } from '../playlist/playlist.component';

const routes: Routes = [
  { path: 'auth', component:SpotifyComponent},
  {
    path: '', component: SpotifyLayoutComponent, children: [
      // {path:'auth', component:SpotifyComponent},
      { path: 'top/tracks', component: TopTracksComponent },
      { path: 'top/artists', component: TopArtistsComponent },
      { path: 'playlists', component: PlaylistListComponent },
      { path: 'playlists/:playlist_id', component: PlaylistComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class SpotifyLayoutRoutingModule { }
