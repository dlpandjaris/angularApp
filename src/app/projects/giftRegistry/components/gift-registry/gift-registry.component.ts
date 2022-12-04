import { Component, OnInit, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';

import { NgbActiveOffcanvas, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OffcanvasService } from '../../services/offcanvas.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-gift-registry',
  templateUrl: './gift-registry.component.html',
  styleUrls: ['./gift-registry.component.scss']
})
export class GiftRegistryComponent implements OnInit {

  closeResult = '';

  public fullName: string = "";
  public role!: string;
  constructor(
    private offcanvasService: NgbOffcanvas,
    public offcanvasNavService: OffcanvasService,
    private userService: UserService,
    private userStoreService: UserStoreService,
    private router: Router
  ) { 
    this.offcanvasNavService.displayForm = 'Login';
  }

  ngOnInit(): void {
    if(this.userService.isLoggedIn()) {
      this.offcanvasNavService.displayForm = 'Account Info';
    }

    this.userStoreService.getFullNameFromStore()
    .subscribe(res=>{
      let fullNameFromToken = this.userService.getFullNameFromToken();
      this.fullName = res || fullNameFromToken;
    })

    this.userStoreService.getRoleFromStore()
    .subscribe(res=>{
      let roleFromToken = this.userService.getRoleFromToken();
      this.role = res || roleFromToken;
    })
  }

  open(content: TemplateRef<any>) {
		this.offcanvasService.open(content, { position: 'end' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			},
			(reason) => {
				this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
			},
		);
	}

	private getDismissReason(reason: any): string {
		if (reason === OffcanvasDismissReasons.ESC) {
			return 'by pressing ESC';
		} else if (reason === OffcanvasDismissReasons.BACKDROP_CLICK) {
			return 'by clicking on the backdrop';
		} else {
			return `with: ${reason}`;
		}
	}
  
  setDisplayForm(form: string) {
    this.offcanvasNavService.displayForm = form;
  }

  navigateToGroupDashboard() {
    this.router.navigate(['projects/gift-registry/group-dashboard']);
  }

  navigateToAdminDashboard() {
    this.router.navigate(['projects/gift-registry/admin-dashboard']);
  }

}
