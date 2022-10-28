import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import * as jwt_decode from 'jwt-decode';
import { StorageUtils } from '../shared/storage-utils';


@Injectable({ providedIn: 'root' })
export class AuthGuardService implements CanActivate {
    constructor(
        private router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        const token = StorageUtils.getAuthToken();
        if (token) {
            if (this.checkRoles(token) && !(route.data && route.data.page)) {
                return true;
            } else {
                if ((!route.data && route.data.page)) {
                    this.router.navigate(['/login']);
                } else {
                    return true;
                }
              
            }
        } else {
            if (!(route.data && route.data.page)) {
                this.router.navigate(['/login']);
            } else {
                return true;
            }
        }
    }

    checkRoles(token){
        const tokenDecode = jwt_decode(token);                
        if (tokenDecode.authorities && tokenDecode.authorities.find(element => element === 'ROLE_EMPLOYEE')) {
            return true;
        }else{
            return false;
        }


    }
}
