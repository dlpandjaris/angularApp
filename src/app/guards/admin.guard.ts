import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../projects/giftRegistry/services/user.service';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard  {
  constructor(
    private userService: UserService,
    private router: Router,
    private toastService: ToastService) {
    
  }

  canActivate():boolean {
    const token = this.userService.getToken()
    if(token) {
      if(this.userService.getDecodedToken().role == 'admin') {
        return true;
      } else {
        this.router.navigate(['projects/gift-registry']);
        this.toastService.show('Failure', 'Whatcha doin there?');
        return false;
      }
    } else {
      this.router.navigate(['projects/gift-registry']);
      this.toastService.show('Failure', 'Whatcha doin there?');
      return false;
    }
  }
}
