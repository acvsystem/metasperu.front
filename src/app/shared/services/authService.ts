import { EventEmitter, Injectable, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { StorageService } from '@metasperu/utils/storage';
import { GlobalConstants } from '@metasperu/const/globalConstants';
import { ShareService } from './shareService';
import { User } from '@metasperu/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private api = GlobalConstants.backendServer;
  @Output() eventIsLoggedIn: EventEmitter<any> = new EventEmitter();
  @Output() onProfileUser: EventEmitter<any> = new EventEmitter();
  @Output() onMenuUser: EventEmitter<any> = new EventEmitter();

  constructor(private store: StorageService, private shareService: ShareService, private toastr: ToastrService) { }

  public login(userName, password): Promise<any> {
    let parms = {
      url: '/security/login',
      body: { "usuario": userName, "password": password }
    };

    return this.shareService.post(parms).then((response) => {
      const profile = ((response || [])[0].profile || {});
      const token = ((response || [])[0].auth || {}).token;
      const pageDefault = ((response || [])[0].page || {}).default;

      if (token) {

        let userProfile: User = {
          username: profile?.nameTienda || profile?.name,
          email: profile?.email,
          name: profile?.name,
          token: token,
          nivel: profile?.nivel,
          defaultRoute: pageDefault,
        }

        this.eventIsLoggedIn.emit(true);
        this.store.setStore('tn', token);
        this.onProfileUser.emit(((response || [])[0] || {}));
        this.onMenuUser.emit(((response || [])[0].menu || {}));
        return userProfile;
      } else {
        this.eventIsLoggedIn.emit(false);
        return [];
      }
    });
  }

  logout() {
    this.store.removeStore('tn');
  }

  getToken() {
    return this.store.getStore('tn');
  }
}
