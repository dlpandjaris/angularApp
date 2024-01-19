import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpotifyComponent } from '../spotify/spotify.component';
import { TopComponent } from '../top/top.component';
import { SpotifyLayoutComponent } from '../spotify-layout/spotify-layout.component';

const routes: Routes = [
  { path: 'auth', component:SpotifyComponent},
  {
    path: '', component: SpotifyLayoutComponent, children: [
      // {path:'auth', component:SpotifyComponent},
      {path:'top', component:TopComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)], 
  exports: [RouterModule]
})
export class SpotifyLayoutRoutingModule { }
