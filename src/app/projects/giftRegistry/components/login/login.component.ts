import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'

import { OffcanvasService } from '../../services/offcanvas.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  displayForm: string = "Login";

  constructor(public offcanvasNavService: OffcanvasService) { }

  ngOnInit(): void {
  }

  
  setDisplayForm(form: string) {
    this.offcanvasNavService.displayForm = form;
    this.displayForm = form;
  }
}
