import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  private baseUrl: string = 'http://localhost:5000/group'
  constructor(private http: HttpClient) { }

  private _refreshRequired = new Subject<void>();

  get refreshRequired() {
    return this._refreshRequired;
  }

  getAllGroups(): Observable<object> {
    return this.http.get<any>(this.baseUrl);
  }

  getGroupById(id: string): Observable<object> {
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  updateGroup(inputData: any) {
    return this.http.post(this.baseUrl, inputData).pipe(
      tap(()=>{
        this.refreshRequired.next();
      })
    );
  }
}
