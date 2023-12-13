import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from 'src/app/services/toast.service';

import { OffcanvasService } from '../../services/offcanvas.service';
import { UserStoreService } from '../../services/user-store.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  type: string = "password";
  isText: boolean = false;
  eyeIcon: string = "fa-eye-slash";

  loginForm!: FormGroup;

  constructor(
    public offcanvasNavService: OffcanvasService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private router: Router,
    public toastService: ToastService,
    public ngbOffCanvas: NgbOffcanvas,
    private userStoreService: UserStoreService
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
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
    if(this.loginForm.valid) {
      console.log(this.loginForm.value);
      // send to backend
      this.userService.authenticate(this.loginForm.value)
      .subscribe({
        next:(res)=>{
          this.toastService.show('Success', res.message);
          this.loginForm.reset();
          this.offcanvasNavService.displayForm = 'Account Info';
          this.userService.storeToken(res.token);

          const tokenPayload = this.userService.getDecodedToken();
          this.userStoreService.setFullNameForStore(tokenPayload.name);
          this.userStoreService.setRoleForStore(tokenPayload.role)

          this.ngbOffCanvas.dismiss('Submitted form');
          this.router.navigate(['projects/gift-registry/group-dashboard']);
        },
        error:(err)=>{
          this.toastService.show('Failure', 'Email/Password incorrect');
        }
      });
    } else {
      console.log("Form is invalid");
      this.validateAllFormFields(this.loginForm);
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
