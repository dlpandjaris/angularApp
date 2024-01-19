import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UserService } from '../projects/giftRegistry/services/user.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private userService: UserService,
    private toastService: ToastService,
    private router: Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // const myToken = this.userService.getToken();
    // const myToken = localStorage.getItem('access_token');

    // if(myToken) {
    //   request = request.clone({
    //     setHeaders: {Authorization: myToken}
    //   });
    // }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if (err instanceof HttpErrorResponse) {
          // this.toastService.show('Failure', `${err.status.toString()}: ${err.message} ${err.url}`);
          if (err.status === 401) {
            this.toastService.show('Failure', 'Token expired, please login again');
            if (err.url == 'https://api.spotify.com/v1/me') {
              // this.router.navigateByUrl('projects/spotify/auth');
            } else {
              this.router.navigateByUrl('portfolio');
            }
          }
        }
        return throwError(()=> new Error('Some other error occured'))
      })
    );
  }
}
