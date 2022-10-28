import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AbsenceService {

  constructor(private http: HttpClient) { }



  /**
   * 
   * @param page index
   * @param pageCount page count
   * @param sort sort atribute
   * @param direction direction
   * @param idCompany company id
   * @param filter filter 
   * @param establishementFilter establishemnt filter
   * @param criteria criteria
   */
  getAllAbsences(page, pageCount, sort, direction, idCompany, filter?, leaveStartDate?, leaveEndDate?): Observable<any> {
    const filterParam = filter ? `&status=${filter}` : '';
    const startDate = leaveStartDate ? `&startDate=${leaveStartDate}` : '';
    const endDate = leaveEndDate ? `&endDate=${leaveEndDate}` : '';
    const req = environment.ENDPOINTS
      .COMPANY_MANAGEMENT_COMPANY_URL + `/${idCompany}/absences/mine` + `?size=${pageCount}&page=${page}&sort=${sort},${direction}` +
      filterParam + startDate + endDate;
    return this.http.get<any>(req, { observe: 'response' });
  }

  getAbsenceById(companyId, absenceId) {
    const url = environment.ENDPOINTS
      .COMPANY_MANAGEMENT_COMPANY_URL + `/${companyId}` + environment
        .ENDPOINTS.GET_SINGLE_ABSENCE_URL + `/${absenceId}/mine`;
    return this.http.get(url);
  }

  createAbsence(companyId, absence) {
    const url = environment.ENDPOINTS
      .COMPANY_MANAGEMENT_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.GET_ABSENCE_URL;
    return this.http.post(url, absence);
  }

  deleteAbsenceRequest(companyId, absenceId) {
    const url = environment.ENDPOINTS
      .COMPANY_MANAGEMENT_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.GET_SINGLE_ABSENCE_URL + `/${absenceId}/mine`;
    return this.http.delete(url);
  }

  updateAbsence(companyId, absenceId, absence): Observable<any> {
    const url = environment.ENDPOINTS
      .COMPANY_MANAGEMENT_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.GET_SINGLE_ABSENCE_URL + `/${absenceId}/mine`;
    return this.http.put(url, absence);
  }
  askToCancelAcceptedAbsenceRequest(companyId, absenceRequestId) {
    const url = environment.ENDPOINTS.COMPANY_MANAGEMENT_COMPANY_URL + `/${companyId}` +
      environment.ENDPOINTS.GET_SINGLE_ABSENCE_URL + `/${absenceRequestId}/mine/cancel`;
    return this.http.post(url, {});
  }

  getCompanyWeekEndDays(companyId) {
    const url = environment.ENDPOINTS.COMPANY_MANAGEMENT_COMPANY_URL + `/${companyId}` + environment.ENDPOINTS.WEEK_END_DAYS;
    return this.http.get(url);
  }

  /**
   * Get day index.
   * @param day The day.
   */
  getDayIndex(day) {
    let index;
    switch (day) {
      case 'SUNDAY':
        index = 0;
        break;
      case 'MONDAY':
        index = 1;
        break;
      case 'TUESDAY':
        index = 2;
        break;
      case 'WEDNESDAY':
        index = 3;
        break;
      case 'THURSDAY':
        index = 4;
        break;
      case 'FRIDAY':
        index = 5;
        break;
      case 'SATURDAY':
        index = 6;
        break;
    }
    return index;
  }

  /**
   * get count of day between 2 dates
   * @param item the day
   * @param startDate start date
   * @param endDate end date.
   */
  getdayCountBetweenDates(item, startDate, endDate) {
    let totalSundays = 0;

    for (const i = new Date(startDate);
      i <= new Date(endDate); i.setDate(i.getDate() + 1)) {
      if (i.getDay() === item) { totalSundays++; }
    }
    return totalSundays;
  }
}
