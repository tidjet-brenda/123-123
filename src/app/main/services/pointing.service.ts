import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';


@Injectable({
  providedIn: 'root'
})
export class PointingService {

  scheduleUrl = environment.ENDPOINTS.SCHEDULE_URL;

  constructor(private http: HttpClient) { }

  getDayPointing(companyId, month): Observable<any> {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` +
      environment.ENDPOINTS.MONTH_POINTING + `/mine?month=${month}&sort=entrance,desc&page=0&size=2000`
    return this.http.get(url);
  }

  postPointing(companyId, qrCodeId, value) {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` +
      environment.ENDPOINTS.EMPLOYEE_QRC_CODE_POINTING + `/${qrCodeId}/pointing`;
    return this.http.post(url, value);
  }

  //fetch plannings
  getPlannings(campanyId: number) {
    const url = `${this.scheduleUrl}/${campanyId}/my-schedule`;
    return this.http.get<any>(url);
  }
}
