import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { IRequestParams } from '../const/IRequestParams';
import { catchError, retryWhen, tap } from 'rxjs/operators';
import { genericRetryStrategy } from '../utils/rxjUtils';
import { of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  @Output() eventShowLoading: EventEmitter<string> = new EventEmitter()
  
  constructor(private http: HttpClient) { }

  private getParams(paramList: IRequestParams) {
    let params = new HttpParams();
    try {
      ((paramList || {}).parms || []).forEach((element) => {
        params = params.append(element.key, element.value);
      });
    } catch (e) { }
    return params;
  }

  private getHeader(headerList: IRequestParams) {
    let headers = new HttpHeaders();
    try {
      ((headerList || {}).headers || []).forEach((element) => {
        headers = headers.append(element.key, element.value);
      });
    } catch (e) { }
    return headers;
  }

  post(request: IRequestParams, returnError?: boolean) {
    let params = this.getParams(request);
    let headers = this.getHeader(request);
    let body: any = null;
    let URL = `${request.server}${request.url}`;
    let file = new FormData();

    if (request.file) {
      file.append('file', request.file, request.file['name']);
    } else {
      body = request.body;
    }

    this.eventShowLoading.emit('true');

    return this.http.post(URL, body).pipe(
      tap((x) => this.eventShowLoading.emit('false')),
      retryWhen(
        genericRetryStrategy({
          excludedStatusCodes: [401, 403, 400, 500]
        }),
      ),
      catchError((error) => {
        this.eventShowLoading.emit('false');
        if (returnError) return of(error);
        else return throwError(error);
      }),
    );
  }
}
