import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './projects/giftRegistry/components/admin-dashboard/admin-dashboard.component';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';
import { GroupDashboardComponent } from './projects/giftRegistry/components/group-dashboard/group-dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SpotifyLayoutModule } from './projects/spotify/components/spotify-layout/spotify-layout.module';
// import { SpotifyComponent } from './projects/spotify/components/spotify/spotify.component';
// import { TopComponent } from './projects/spotify/components/top/top.component';
// import { SpotifyLayoutComponent } from './projects/spotify/components/spotify-layout/spotify-layout.component';

const routes: Routes = [
  {path:'', redirectTo:'portfolio', pathMatch:'full'},
  {path:'portfolio', component:PortfolioComponent},
  {path:'projects/gift-registry', component:GiftRegistryComponent, children: [
    {path:'group-dashboard', component:GroupDashboardComponent},
    {path:'admin-dashboard', component:AdminDashboardComponent, canActivate:[AdminGuard]},
  ]},
  {path: 'projects/spotify', loadChildren: () => SpotifyLayoutModule}
  // {path: 'projects/spotify', component: SpotifyLayoutComponent, children: [
  //   {path:'profile', component:SpotifyComponent},
  //   {path:'top', component:TopComponent}
  // ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
