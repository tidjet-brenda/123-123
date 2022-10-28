import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, observable } from 'rxjs';

import { throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from 'app/main/services/auth.service';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';


@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

    errorClass = 'error-snackbar';
    authLogin = '/auth/login';
    requestUrl = [this.authLogin, 'uaa/api/account', 'uaa/api/register', '/uaa/api/account/reset-password/init'];
    constructor(
        private translate: TranslateService,
        private router: Router,
        private authService: AuthService,
        private snackBarService: SnackBarService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
            retry(0),
            catchError((error: HttpErrorResponse) => {
                if (!(error.error instanceof ErrorEvent) &&
                    (this.router.url !== '/pointing/entry' && this.router.url !== '/pointing/exit')) {
                    switch (error.status) {
                        case 400:
                            this.snackBarService.showSnackBar(error.error.title, this.snackBarService.errorSnackBarClass);
                            break;
                        case 401:
                            if (!request.url.includes(this.authLogin) && !request.url.includes('uaa/api/account')) {
                                StorageUtils.removeAuthToken();
                                StorageUtils.removeUser();
                                localStorage.clear();
                                this.authService.setAuthenticated(false);
                                this.router.navigate(['/login']);

                            } else if (request.url.includes('/auth/login')) {
                                this.snackBarService.showSnackBar(error.error.title, this.snackBarService.errorSnackBarClass);
                            }
                            break;
                        case 404:
                            if (!request.url.includes('/api/users/email')
                                && !request.url.includes('/uaa/api/account/reset-password/init')) {
                                this.snackBarService.showSnackBar('errors.standardErrorMessage404', 
                                this.snackBarService.errorSnackBarClass);
                            }
                            break;
                        case 403:
                            if (!this.requestUrl.includes(request.url)) {
                                this.snackBarService.showSnackBar('errors.standardErrorMessage403', 
                                this.snackBarService.errorSnackBarClass);
                                this.router.navigate(['/login']);
                            }
                            break;
                        case 500:
                            if (request.url.includes('/api/activate')) {
                                this.snackBarService.showSnackBar('L\'activation de ce compte est déjà effectuée', 
                                this.snackBarService.errorSnackBarClass, true);
                            } else {
                                this.snackBarService.showSnackBar('errors.standardErrorMessage500', 
                                this.snackBarService.errorSnackBarClass);
                            }
                            break;
                        default:
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }
}
