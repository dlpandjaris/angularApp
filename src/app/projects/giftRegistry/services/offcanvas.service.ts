import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OffcanvasService {

  displayForm: string = '';

  constructor() { }

  get data(): any{
    return this.displayForm;
  }

  set data(val: any){
    this.displayForm = val;
    console.log(this.displayForm);
  }
}
