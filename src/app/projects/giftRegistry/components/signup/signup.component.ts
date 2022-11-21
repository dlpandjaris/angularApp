import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'

import { OffcanvasService } from '../../services/offcanvas.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  signupForm!: FormGroup;

  constructor(
    public offcanvasNavService: OffcanvasService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  hideShowPass() {
    this.isText = !this.isText;
    this.isText ? this.eyeIcon = "fa-eye" : this.eyeIcon = "fa-eye-slash";
    this.isText ? this.type = "text" : this.type = "password";
  }

  setDisplayForm(form: string) {
    this.offcanvasNavService.displayForm = form;
  }

  onSubmit(){
    if(this.signupForm.valid) {
      console.log(this.signupForm.value);
      // send to backend
    }else{
      console.log("Form is invalid");
      this.validateAllFormFields(this.signupForm);
      //throw error
    }
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field=>{
      const control = formGroup.get(field);
      if(control instanceof FormControl) {
        control.markAsDirty({onlySelf:true});
      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    })
  }

}
