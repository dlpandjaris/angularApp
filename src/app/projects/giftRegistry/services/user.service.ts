import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "http://localhost:5000/user";
  constructor(private http: HttpClient) { }

  create(userObj:any) {
    return this.http.post<any>(`${this.baseUrl}/create`, userObj);
  }

  authenticate(userObj:any) {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, userObj);
  }
}
