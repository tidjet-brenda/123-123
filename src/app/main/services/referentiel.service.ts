import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { StorageUtils } from '../shared/storage-utils';
@Injectable({
    providedIn: 'root',
})
export class ReferentielService {
    communesUrl = environment.ENDPOINTS.COMMUNES_URL;
    wilayaUrl = environment.ENDPOINTS.WILAYAS_URL;
    professionsUrl = environment.ENDPOINTS.PROFESSION_URL;
    constructor(private httpClient: HttpClient) { }

    getLocalWilaya(code) {
        if (StorageUtils.getEmployeeWilaya()) {
            return StorageUtils.getEmployeeWilaya().find(wilaya=> wilaya.code === code);
        } else {
            return null;
        }
        
   }

    getLocalComune(code) {
        if (StorageUtils.getEmployeeCommune()) {
            return StorageUtils.getEmployeeCommune().find(commune=> commune.code === code);
        } else {
            return null;
        }
       
    }
    
    getUserWilaya(codes){
        const req = this.wilayaUrl+`?codes=${codes}`;
        return this.httpClient.get<any>(req);
    }

    getUserCommunes(codes){
        const req = this.communesUrl+`?codes=${codes}`;
        return this.httpClient.get<any>(req);
    }
}
