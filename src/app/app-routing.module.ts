import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './projects/giftRegistry/components/admin-dashboard/admin-dashboard.component';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';
import { GroupDashboardComponent } from './projects/giftRegistry/components/group-dashboard/group-dashboard.component';
import { SpotifyComponent } from './projects/spotify/components/spotify/spotify.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';

const routes: Routes = [
  {path:'', redirectTo:'portfolio', pathMatch:'full'},
  {path:'portfolio', component:PortfolioComponent},
  {path:'projects/gift-registry', component:GiftRegistryComponent},
  {path:'projects/gift-registry/group-dashboard', component:GroupDashboardComponent},
  {path:'projects/gift-registry/admin-dashboard', component:AdminDashboardComponent, canActivate:[AdminGuard]},
  {path:'projects/spotify', component:SpotifyComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
