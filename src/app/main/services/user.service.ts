import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    bloodGroupList = [
        { name: 'O+', value: 'O_POSITIVE' }, { name: 'O-', value: 'O_NEGATIVE' }, { name: 'A+', value: 'A_POSITIVE' },
        { name: 'A-', value: 'A_NEGATIVE' }, { name: 'B+', value: 'B_POSITIVE' }, { name: 'B-', value: 'B_NEGATIVE' },
        { name: 'AB+', value: 'AB_POSITIVE' }, { name: 'AB-', value: 'AB_NEGATIVE' }
    ];

    getUserInfo(): Observable<any> {
        return this.http.get(environment.ENDPOINTS.USER_PROFILE_URL);
    }
}