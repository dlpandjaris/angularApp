import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "http://localhost:5000/user";
  private userPayload: any;
  constructor(
    private http: HttpClient) { 
      this.userPayload = this.getDecodedToken();
    }

  create(userObj:any) {
    return this.http.post<any>(`${this.baseUrl}/create`, userObj);
  }

  authenticate(userObj:any) {
    return this.http.post<any>(`${this.baseUrl}/authenticate`, userObj);
  }

  clearToken() {
    localStorage.clear();
  }

  storeToken(tokenValue: string) {
    localStorage.setItem('token', tokenValue);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getDecodedToken(): any {
    const token = this.getToken()!;
    try {
      console.log(jwt_decode(token));
      return jwt_decode(token);
    } catch(error) {
      return null;
    }
  }

  getAllUsers() {
    return this.http.get<any>(this.baseUrl);
  }

  getFullNameFromToken() {
    if(this.userPayload) {
      return this.userPayload.name;
    }
  }

  getRoleFromToken() {
    if(this.userPayload) {
      return this.userPayload.role;
    }
  }
}
