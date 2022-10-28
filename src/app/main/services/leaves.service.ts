import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeavesService {

  constructor(private http: HttpClient) { }


  getAllLeaves(page, pageCount, sort, direction, idCompany, filter?, filterStatus?, leaveStartDate?, leaveEndDate?): Observable<any> {
    const filterParam = filter ? `&year=${filter}` : '';
    const filterStatusParam = filterStatus ? `&status=${filterStatus}` : '';
    const startDate = leaveStartDate ? `&startDate=${leaveStartDate}` : '';
    const endDate = leaveEndDate ? `&endDate=${leaveEndDate}` : '';
    const req = environment.ENDPOINTS
      .PAY_COMPANY_URL + `/${idCompany}` + environment.ENDPOINTS.LEAVE_REQUESTS_URL +
      `?size=${pageCount}&page=${page}&sort=${sort},${direction}` +
      filterParam + filterStatusParam + startDate + endDate;
    return this.http.get<any>(req, { observe: 'response' });
  }

  getLeaveById(companyId, leaveId): Observable<any> {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.LEAVE_URL_BY_ID + `${leaveId}/mine`;
    return this.http.get(url);
  }

  getExercise(companyId, onlyWithRemainingDays?): Observable<any> {
    const withRemainingDays = onlyWithRemainingDays !== null && onlyWithRemainingDays !== undefined ?
      `&onlyWithRemainingDays=` + onlyWithRemainingDays : ``;
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` +
      environment.ENDPOINTS.EMPLOYEE_EXERCISES_URL + `?page=0&size=2000&sort=year,asc${withRemainingDays}`;
    return this.http.get(url);
  }

  createRequestLeave(companyId, leave) {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.LEAVE_REQUESTS_URL;
    return this.http.post(url, leave);
  }

  updateRequestLeave(companyId, leave) {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.LEAVE_REQUESTS_URL;
    return this.http.put(url, leave);
  }

  deleteLeaveRequest(companyId, leaveId) {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.LEAVE_URL_BY_ID + `${leaveId}/mine`;
    return this.http.delete(url);
  }

  askToCancelAcceptedLeaveRequest(companyId, leaveRequestId) {
    const url = environment.ENDPOINTS.PAY_COMPANY_URL + `/${companyId}` +
      environment.ENDPOINTS.LEAVE_URL_BY_ID + `${leaveRequestId}/mine/cancel`;
    return this.http.post(url, {});
  }

}
