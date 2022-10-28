import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private http: HttpClient) { }

  getAllNotifications(): Observable<any> {
    return this.http.get(environment.ENDPOINTS.NOTIFICATION_URL);
  }

  markNotificationAsRead(id) {
    const NOTIF_ID = id !== null && id !== undefined ? `/${id}` : ``;
    const url = environment.ENDPOINTS.NOTIFICATION_URL + NOTIF_ID;
    return this.http.post(url, {});
  }
}
