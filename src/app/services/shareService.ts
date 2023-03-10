import { Injectable } from '@angular/core';
import { concatMap, of, throwError } from 'rxjs';
import { IRequestParams } from '../const/IRequestParams';
import { StorageService } from '../utils/storage';
import { HttpService } from './httpService';

@Injectable({
  providedIn: 'root'
})
export class ShareService {
  private hearders: Array<{ key: string; value: string }> = [];
  private intPost = 0;
  private responseHttp:any;

  constructor(private store: StorageService, private xhr: HttpService) { }

  public post(parms_: IRequestParams): Promise<any> {
    const self = this;
/*
    let token = self.store.getStore('tn');

    if (typeof parms_.isAuth === 'undefined') {
      if (typeof token == 'undefined') {
        return Promise.resolve(throwError(-1));
      }
    }
    this.hearders = [];
    this.hearders.push({ key: 'Authorization', value: 'bearer ' + token });
    if (parms_.isAuth) {
      this.hearders = this.hearders.filter(p => p.key !== 'Authorization');
    }

    let serverUrl = typeof parms_._serverUrl === 'undefined' ? '' : parms_._serverUrl;
*/
    let parms: IRequestParams = {
      url: parms_.url,
      headers: this.hearders,
      parms: parms_.parms,
      body: parms_.body,
      server: parms_.server,
      file: parms_.file
    };
    
   /* if (serverUrl.length > 0) {
      Object.assign(parms, {
        _serverUrl: serverUrl
      });
    }*/

    this.xhr
      .post(parms, true).subscribe((response) => {
        console.log(response);
        if (response.status == 401) {
          this.intPost++;
          if (this.intPost >= 3) {
            this.intPost = 0;
            this.responseHttp = of([]);
          }
        } else if (response.status == 403 || response.status == 400) {
          this.responseHttp = of(response);
        } else if (response['statusText'] == 'Unknown Error') {
          this.responseHttp = of([]);
        } else {
          this.responseHttp = of(response);
        }
      });

      return this.responseHttp;
  }

}
