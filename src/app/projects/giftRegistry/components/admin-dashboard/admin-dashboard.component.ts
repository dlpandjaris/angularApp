import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public users: any = [];
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getAllUsers()
    .subscribe(res=>{
      this.users = res;
    })
  }

}
