import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { ToastService } from 'src/app/services/toast.service';

import { OffcanvasService } from '../../services/offcanvas.service';
import { UserService } from '../../services/user.service';

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
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.signupForm = this.formBuilder.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
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
      this.userService.create(this.signupForm.value)
      .subscribe({
        next:(res)=>{
          this.toastService.show('Success', res.message);
          this.signupForm.reset();
          this.setDisplayForm('Login');
        },
        error:(err)=>{
          this.toastService.show('Failure', err?.error.message);
        }
      });
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
