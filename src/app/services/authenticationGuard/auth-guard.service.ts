import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(private AuthService: AuthenticationService, private Router: Router) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.AuthService.checkUserLogin()) {
      return true
    } else {
      return this.Router.navigate(['/login'])
    }
  }
}
