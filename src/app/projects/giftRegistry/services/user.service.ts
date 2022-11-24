import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import jwt_decode from 'jwt-decode';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private baseUrl: string = "http://localhost:5000/user";
  constructor(
    private http: HttpClient) { }

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

  getDecodedToken(token: any): any {
    try {
      return jwt_decode(token);
    } catch(Error) {
      return null;
    }
  }

  getAllUsers() {
    return this.http.get<any>(this.baseUrl);
  }

  // getUserInfo() {
  //   const userId = this.getDecodedToken(this.getToken()).id.split(' ')[0];
  //   return this.http.get<any>(`${this.baseUrl}/${userId}`);
  // }
}
