import { Component, OnInit } from '@angular/core';
import { GroupService } from '../../services/group.service';

@Component({
  selector: 'app-group-dashboard',
  templateUrl: './group-dashboard.component.html',
  styleUrls: ['./group-dashboard.component.scss']
})
export class GroupDashboardComponent implements OnInit {

  public groups: any = [];
  constructor(private groupService: GroupService) { }

  ngOnInit(): void {
    this.groupService.getAllGroups()
    .subscribe(res=>{
      this.groups = res;
    })
  }

  getFirstId() {
    return this.groups[0];
  }

}
