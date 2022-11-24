import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { OffcanvasService } from '../../services/offcanvas.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  user!: User;

  constructor(
    private userService: UserService,
    private offCanvasNavService: OffcanvasService) { }

  ngOnInit(): void {
  }

  logOut() {
    this.userService.clearToken();
    this.offCanvasNavService.displayForm = 'Login';
  }

  // getUserInfo(): void {
  //   this.user = this.userService.getUserInfo(this.userService.getDecodedToken(this.userService.getToken).id);
  // }

}
