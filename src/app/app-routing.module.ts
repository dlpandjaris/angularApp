import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';
import { AdminDashboardComponent } from './projects/giftRegistry/components/admin-dashboard/admin-dashboard.component';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';
import { GroupDashboardComponent } from './projects/giftRegistry/components/group-dashboard/group-dashboard.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { SpotifyLayoutModule } from './projects/spotify/components/spotify-layout/spotify-layout.module';
import { ProjectsComponent } from './components/projects/projects.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ContactComponent } from './components/contact/contact.component';
import { TerminalComponent } from './components/terminal/terminal.component';

const routes: Routes = [
  {path:'', component: PortfolioComponent, children: [
  // {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: TerminalComponent},
  {path: 'projects', component: ProjectsComponent},
  {path: 'resume', component: ResumeComponent},
  {path: 'contact', component: ContactComponent},
  ]},
  {path:'projects/gift-registry', component:GiftRegistryComponent, children: [
    {path:'group-dashboard', component:GroupDashboardComponent},
    {path:'admin-dashboard', component:AdminDashboardComponent, canActivate:[AdminGuard]},
  ]},
  {path: 'projects/spotify', loadChildren: () => SpotifyLayoutModule}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], 
  exports: [RouterModule]
})
export class AppRoutingModule { }
