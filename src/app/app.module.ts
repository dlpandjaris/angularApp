import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule, NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';
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
import { PortfolioComponent } from './components/portfolio/portfolio.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { TerminalButtonComponent } from './components/terminal-button/terminal-button.component';
import { TerminalContentComponent } from './components/terminal-content/terminal-content.component';
import { ProjectCardComponent } from './components/project-card/project-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DragDropModule } from '@angular/cdk/drag-drop';
// import { SpotifyComponent } from './projects/spotify/components/spotify/spotify.component';
// import { NavbarComponent } from './projects/spotify/components/navbar/navbar.component';
// import { TopComponent } from './projects/spotify/components/top/top.component';
// import { PlayerFooterComponent } from './projects/spotify/components/player-footer/player-footer.component';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { TerminalComponent } from './components/terminal/terminal.component';
import { ContactComponent } from './components/contact/contact.component';
import { ResumeComponent } from './components/resume/resume.component';
import { ProjectsComponent } from './components/projects/projects.component';

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
    PortfolioComponent,
    WelcomeComponent,
    TerminalButtonComponent,
    TerminalContentComponent,
    ProjectCardComponent,
    // SpotifyComponent,
    // TopComponent,
    // PlayerFooterComponent
    NavbarComponent,
    TerminalComponent,
    PortfolioComponent,
    ContactComponent,
    ResumeComponent,
    ProjectsComponent,
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    NgbPopoverModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
    DragDropModule,
    // ProjectCardComponent,
  ]
})
export class AppModule { }
