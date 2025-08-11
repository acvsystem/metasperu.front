import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { IRequestParams } from '../const/IRequestParams';
import { catchError, retryWhen, tap } from 'rxjs/operators';
import { genericRetryStrategy } from '../utils/rxjUtils';
import { of, throwError } from 'rxjs';
import { StorageService } from '../utils/storage';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  @Output() eventShowLoading: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient, private store: StorageService) { }

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

    this.eventShowLoading.emit(true);
    return this.http.post(URL, body || file, { headers, params }).pipe(
      tap((x) => this.eventShowLoading.emit(false)),
      retryWhen(
        genericRetryStrategy({
          excludedStatusCodes: [401, 403, 400, 500],
        }),
      ),
      catchError((error) => {
        this.eventShowLoading.emit(false);
        if (returnError) return of(error);
        else return throwError(error);
      }),
    );
  }

  get(request: IRequestParams, returnError?: boolean) {

    let params = this.getParams(request);
    let headers = this.getHeader(request);
    let URL = `${request.server}${request.url}`;

    this.eventShowLoading.emit(true);

    return this.http.get(URL, { headers, params }).pipe(
      tap((x) => this.eventShowLoading.emit(false)),
      retryWhen(
        genericRetryStrategy({
          excludedStatusCodes: [401, 403, 400, 500],
        }),
      ),
      catchError((error) => {
        this.eventShowLoading.emit(false);
        if (returnError) return of(error);
        else return throwError(error);
      }),
    );
  }

  getDownload(request: IRequestParams, returnError?: boolean) {

    let params = this.getParams(request);
    let headers = this.getHeader(request);
    let URL = `${request.server}${request.url}`;

    this.eventShowLoading.emit(true);

    return this.http.get<Blob>(URL, { headers, params, observe: 'response', responseType: 'blob' as 'json' }).pipe(
      tap((x) => this.eventShowLoading.emit(false)),
      retryWhen(
        genericRetryStrategy({
          excludedStatusCodes: [401, 403, 400, 500],
        }),
      ),
      catchError((error) => {
        this.eventShowLoading.emit(false);
        if (returnError) return of(error);
        else return throwError(error);
      }),
    );
  }

  
  
}