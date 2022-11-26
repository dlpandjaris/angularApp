import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {

  public users: any = [];
  public groups: any = [];
  
  constructor(
    private userService: UserService,
    private groupService: GroupService) { }

  ngOnInit(): void {
    this.userService.getAllUsers()
    .subscribe(res=>{
      this.users = res;
    })

    this.groupService.refreshRequired.subscribe(res=>{
      this.getGroups()
    });
  }

  getGroups() {
    this.groupService.getAllGroups()
    .subscribe(res=>{
      this.groups = res;
    })
  }

}
