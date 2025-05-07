import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TeeTime } from '../models/tee-time';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeeTimeService {

  private baseUrl: string = "https://tee-time-service-1091750267004.us-central1.run.app";
  // private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getTeeTimes(date: string, players: number, coords: object): Observable<TeeTime[]> {
    return this.http.get<TeeTime[]>(`${this.baseUrl}/tee_times?date=${date}&players=${players}&coords=${JSON.stringify(coords)}`);
  }
}
