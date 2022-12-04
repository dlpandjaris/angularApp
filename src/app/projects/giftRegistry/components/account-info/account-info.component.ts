import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { OffcanvasService } from '../../services/offcanvas.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.scss']
})
export class AccountInfoComponent implements OnInit {

  fullName: string = "";
  constructor(
    private userService: UserService,
    private offCanvasNavService: OffcanvasService,
    private userStoreService: UserStoreService) { }

  ngOnInit(): void {
    this.userStoreService.getFullNameFromStore()
    .subscribe(res=>{
      let fullNameFromToken = this.userService.getFullNameFromToken();
      this.fullName = res || fullNameFromToken;
    })
  }

  logOut() {
    this.userService.clearToken();
    this.offCanvasNavService.displayForm = 'Login';
  }
}
