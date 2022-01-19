import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, retry} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpApiService {
  readonly serverURL: string = 'http://localhost:5000';

  constructor(private http: HttpClient) {
  }

  addBill(body: string): Observable<any> {
    const heads = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    return this.http.post(this.serverURL + '/bill', body, {headers: heads, responseType: 'json'})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getBills(): Observable<string> {
    return this.http.get(this.serverURL + '/bill', {responseType: 'text'})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  getCategories(): Observable<string> {
    return this.http.get(this.serverURL + '/categories', {responseType: 'text'})
      .pipe(
        retry(1),
        catchError(this.handleError)
      );
  }

  handleError(error): Observable<any> {
    const errorMessage = '不能连接到服务器！！！';
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
