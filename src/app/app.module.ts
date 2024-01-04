import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './projects/giftRegistry/components/login/login.component';
import { SignupComponent } from './projects/giftRegistry/components/signup/signup.component';
import { GiftRegistryComponent } from './projects/giftRegistry/components/gift-registry/gift-registry.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GroupDashboardComponent } from './projects/giftRegistry/components/group-dashboard/group-dashboard.component';
import { ToastsComponent } from './components/toasts/toasts.component';
import { AdminDashboardComponent } from './projects/giftRegistry/components/admin-dashboard/admin-dashboard.component';
import { AccountInfoComponent } from './projects/giftRegistry/components/account-info/account-info.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { SpotifyComponent } from './projects/spotify/components/spotify/spotify.component';
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TerminalButtonComponent } from './components/terminal-button/terminal-button.component';
import { TerminalContentComponent } from './components/terminal-content/terminal-content.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NavbarComponent } from './projects/spotify/components/navbar/navbar.component';
import { TopComponent } from './projects/spotify/components/top/top.component';
import { PlayerFooterComponent } from './projects/spotify/components/player-footer/player-footer.component';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    GiftRegistryComponent,
    GroupDashboardComponent,
    ToastsComponent,
    AdminDashboardComponent,
    AccountInfoComponent,
    SpotifyComponent,
    PortfolioComponent,
    WelcomeComponent,
    TerminalButtonComponent,
    TerminalContentComponent,
    ProjectCardComponent,
    NavbarComponent,
    TopComponent,
    NavbarComponent,
    PlayerFooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    DragDropModule
  ],
  providers: [{
    provide:HTTP_INTERCEPTORS,
    useClass:TokenInterceptor,
    multi:true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
