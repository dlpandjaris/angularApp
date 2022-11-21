import { Component, OnInit, TemplateRef } from '@angular/core';

import { NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { OffcanvasService } from '../../services/offcanvas.service';

@Component({
  selector: 'app-gift-registry',
  templateUrl: './gift-registry.component.html',
  styleUrls: ['./gift-registry.component.scss']
})
export class GiftRegistryComponent implements OnInit {

  closeResult = '';

  constructor(
    private offcanvasService: NgbOffcanvas,
    public offcanvasNavService: OffcanvasService
  ) { 
    this.offcanvasNavService.displayForm = 'Login';
  }

  ngOnInit(): void {
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

}
