import { Component } from '@angular/core';
import { IconProvider } from '../../models/icon-provider';
import { UserProfile } from '../../models/user-profile';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-spotify-layout',
  templateUrl: './spotify-layout.component.html',
  styleUrl: './spotify-layout.component.scss'
})
export class SpotifyLayoutComponent {

  iconProvider = IconProvider;
  
  user_profile!: UserProfile;

  constructor(
    private usersService: UsersService) {}

  ngOnInit() {
    this.getUserProfile();
  }

  getUserProfile(): void {
    this.usersService.getCurrentUsersProfile().subscribe((prof: UserProfile) => {
      this.user_profile = prof;
    })
  }
}
