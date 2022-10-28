import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  isConnected = false;
  private authenticated = false;
  constructor(private http: HttpClient, private route: Router) {
  }

  login(credentiels, resp: any): Observable<any> {
    return this.http.post(environment.ENDPOINTS.LOGIN_URL + `?response=${resp}`, credentiels);
  }

  // logout() {
  //     StorageUtils.removeAuthToken();
  //     this.route.navigate(['/login']);
  // }

  activateAccount(params): Observable<any> {
    return this.http.post(environment.ENDPOINTS.ACTIVATE_ACCOUNT_URL, params);
  }

  getResetPasswordLink(email): Observable<any> {
    return this.http.post(environment.ENDPOINTS.FORGOT_PASSWORD_URL, email);
  }

  resetPassword(params): Observable<any> {
    return this.http.post(environment.ENDPOINTS.RESET_PASSWORD_URL, params);
  }

  changePassword(values): Observable<any> {
    return this.http.post(environment.ENDPOINTS.CHANGE_PASSWORD_URL, values);
  }

  logout(): Observable<any> {
    return this.http.post(environment.ENDPOINTS.LOGOUT_URL, '');
  }

  setAuthenticated(auth: boolean) {
    this.authenticated = auth;
  }
  getCSRFToken(): Observable<any> {
    return this.http.get(environment.ENDPOINTS.CSRF_URL);
  }
}