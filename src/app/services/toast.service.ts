import { Injectable } from '@angular/core';


export interface ToastInfo {
  status: string;
  body: string;
  delay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts: ToastInfo[] = [];

  constructor() { }

  show(status: string, body: string) {
    if(status=='Success'){
      this.toasts.push({ status:'bg-success text-light', body });
    }else if(status=='Failure'){
      this.toasts.push({ status:'bg-danger text-light', body })
    }
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
