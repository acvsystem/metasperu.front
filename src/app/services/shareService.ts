import { EventEmitter, Injectable, Output } from '@angular/core';
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
  @Output() eventIsLoggedIn: EventEmitter<any> = new EventEmitter();
  @Output() onProfileUser: EventEmitter<any> = new EventEmitter();
  @Output() onMenuUser: EventEmitter<any> = new EventEmitter();
  @Output() onDisconnectSocket: EventEmitter<any> = new EventEmitter();
  @Output() onNotification: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSelect: EventEmitter<any> = new EventEmitter();

  serverRute: string = 'http://38.187.8.22:3600';

  constructor(private store: StorageService, private xhr: HttpService) { }

  public post(parms_: IRequestParams): Promise<any> {
    const self = this;

    let token = self.store.getStore('tn');

    if (typeof parms_.isAuth === 'undefined') {
      if (typeof token == 'undefined') {
        return Promise.resolve(throwError(-1));
      }
    }
    this.hearders = [];
    this.hearders.push({ key: 'Authorization', value: (token || {}).value });
    if (parms_.isAuth) {
      this.hearders = this.hearders.filter(p => p.key !== 'Authorization');
    }

    let serverUrl = typeof parms_._serverUrl === 'undefined' ? '' : parms_._serverUrl;

    let parms: IRequestParams = {
      url: parms_.url,
      headers: this.hearders,
      parms: parms_.parms,
      body: parms_.body,
      server: this.serverRute,
      file: parms_.file
    };

    /* if (serverUrl.length > 0) {
       Object.assign(parms, {
         _serverUrl: serverUrl
       });
     }*/

    return this.xhr
      .post(parms, true)
      .pipe(
        concatMap((response) => {
          if (response.status == 401) {
            this.intPost++;
            if (this.intPost >= 3) {
              this.intPost = 0;
              return of([]);
            }
            return [{ msj: "login" }];
          } else if (response.status == 403 || response.status == 400) {
            return of(response);
          } else if (response['statusText'] == 'Unknown Error') {
            return of([]);
          } else {
            return of(response);
          }
        }),
      )
      .toPromise();
  }

  public get(parms_: IRequestParams): Promise<any> {
    const self = this;

    let token = self.store.getStore('tn');

    if (typeof parms_.isAuth === 'undefined') {
      if (typeof token == 'undefined') {
        return Promise.resolve(throwError(-1));
      }
    }
    this.hearders = [];
    this.hearders.push({ key: 'Authorization', value: (token || {}).value });
    if (parms_.isAuth) {
      this.hearders = this.hearders.filter(p => p.key !== 'Authorization');
    }

    let serverUrl = typeof parms_._serverUrl === 'undefined' ? '' : parms_._serverUrl;

    /* if (serverUrl.length > 0) {
       Object.assign(parms, {
         _serverUrl: serverUrl
       });
     }*/

    let parms: IRequestParams = {
      url: parms_.url,
      headers: this.hearders,
      parms: parms_.parms,
      server: this.serverRute
    };



    return this.xhr
      .get(parms, true)
      .pipe(
        concatMap((response) => {
          if (response.status == 401) {
            this.intPost++;
            if (this.intPost >= 3) {
              this.intPost = 0;
              return of([]);
            }
            return [response];
          } else if (response.status == 403 || response.status == 400) {
            return of(response);
          } else if (response['statusText'] == 'Unknown Error') {
            return of([]);
          } else {
            return of(response);
          }
        }),
      )
      .toPromise();
  }

  createToken(userName, password): Promise<any> {
    let parms = {
      url: '/security/login',
      body: { "usuario": userName, "password": password }
    };

    return this.post(parms).then((response) => {
      let token = ((response || {}).auth || {}).token;
      if (token) {
        this.eventIsLoggedIn.emit(true);
        this.store.setStore('tn', token);
        this.onProfileUser.emit(((response || {}).profile || {}));
        this.onMenuUser.emit(((response || {}).menu || {}));
        return token;
      } else {
        this.eventIsLoggedIn.emit(false);
      }
    });
  }

}
