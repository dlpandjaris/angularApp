import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';

const routes: Routes = [
  {path:'', redirectTo:'projects/gift-registry', pathMatch:'full'},
  {path:'projects/gift-registry', component:GiftRegistryComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
