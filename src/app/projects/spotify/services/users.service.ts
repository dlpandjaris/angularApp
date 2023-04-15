import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private baseUrl: string = "https://api.spotify.com/v1/me";
  constructor(private http: HttpClient) { }

  getTopItems(token: string, type: string, time_range: string) {
    return this.http.get<any>(`${this.baseUrl}/top/${type}`, {
      headers: { Authorization: `Bearer ${token}` },
      params: { time_range: time_range, limit: 50 }
    });
  }
}
