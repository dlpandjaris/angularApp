import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './projects/giftRegistry/components/login/login.component';
import { SignupComponent } from './projects/giftRegistry/components/signup/signup.component';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    GiftRegistryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }