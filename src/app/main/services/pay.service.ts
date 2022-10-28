import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PayService {
  notifyPrint = new Subject<any>();
  notifyPrint$ = this.notifyPrint.asObservable();
  monthDownloadFileNotify = new Subject<any>();
  monthDownloadFileNotify$ = this.monthDownloadFileNotify.asObservable();
  payUrl = environment.ENDPOINTS.PAY_COMPANY_URL;


  constructor(private http: HttpClient) { }

  getPay(companyId, monthYear): Observable<any> {
    const url = this.payUrl + `/${companyId}` + environment.ENDPOINTS.EMPLOYEE_PAY_URL + `?month=${monthYear}`;
    return this.http.get(url);
  }

  getPlanPayrollSection(folderId, sort?, direction?, positions?, search?): Observable<any> {
    const criteriaPram = search ? `&search=${search}` : '';
    const criteriaPramFilters = positions ? `&positions=${positions}` : '&positions=GAIN,DEDUCTION';
    const req = this.payUrl + `/${folderId}/payroll-section-in-plans?size=2000&sort=${sort},${direction}`
      + criteriaPram + criteriaPramFilters;
    return this.http.get<any>(req, { observe: 'response' });
  }

  notifyPrintFunc() {
    this.notifyPrint.next();
  }

  notifyDownloadFunc() {
    this.monthDownloadFileNotify.next();
  }
}
