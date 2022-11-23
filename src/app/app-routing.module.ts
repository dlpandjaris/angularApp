import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';
import { GroupDashboardComponent } from './projects/giftRegistry/components/group-dashboard/group-dashboard.component';

const routes: Routes = [
  {path:'', redirectTo:'projects/gift-registry', pathMatch:'full'},
  {path:'projects/gift-registry', component:GiftRegistryComponent},
  {path:'projects/gift-registry/group-dashboard', component:GroupDashboardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
