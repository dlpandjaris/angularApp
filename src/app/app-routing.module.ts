import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';
import { LoginComponent } from './projects/giftRegistry/components/login/login.component';
import { SignupComponent } from './projects/giftRegistry/components/signup/signup.component';

const routes: Routes = [
  {path:'', redirectTo:'projects/gift-registry', pathMatch:'full'},
  {path:'projects/gift-registry', component:GiftRegistryComponent},
  {path:'projects/gift-registry/login', component:LoginComponent},
  {path:'projects/gift-registry/signup', component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
