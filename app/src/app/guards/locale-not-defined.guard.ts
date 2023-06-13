import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfigService } from '../services/config.service';

@Injectable({
  providedIn: 'root',
})
export class LocaleNotDefinedGuard  {
  constructor(private configService: ConfigService, public router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.configService.isLocaleSelected()) {
      return false;
    }
    return true;
  }
}
