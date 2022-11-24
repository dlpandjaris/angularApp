import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseUrl: string = 'http://localhost:5000/group'
  constructor(private http: HttpClient) { }

  getAllGroups() {
    return this.http.get<any>(this.baseUrl);
  }
}
