import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { QrCodePointing } from '../shared/models/qrCodePointing.model';
import { CalendarNextViewDirective } from 'angular-calendar/modules/common/calendar-next-view.directive';

@Injectable({ providedIn: 'root' })
export class GeolocationService {
    watchPositionId: number;
    options = {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
    };
    data: QrCodePointing = {
        entryType: null,
        latitude: null,
        longitude: null,
        expiredDate: null
    };
    error: boolean;
    errorStatus: any;
    manageWatchPositionStarted = false;
    initWatchPosition() {
        this.watchPositionId = navigator.geolocation.watchPosition((pos) => this.PositionSuccess(pos),
            (err) => this.PositionError(err), this.options);
    }

    PositionSuccess(pos) {
        this.manageWatchPosition();
        this.error = false;
        const coords = pos.coords;
        this.data.latitude = coords.latitude;
        this.data.longitude = coords.longitude;
        const expiredDate = new Date() ;
        expiredDate.setMinutes(expiredDate.getMinutes() + 1);
        this.data.expiredDate = expiredDate;
        
    }

    PositionError(err) {
        this.error = true;
        if (err.code === 1) {
            this.errorStatus = 'positionPermissionDenied';
        } else if (err.code === 2) {
            this.errorStatus = 'positionUnavailable';
        } else {
            this.errorStatus = 'positionTimeout';
        }
        this.cancelWatchUserPosition();
    }

    getUserPosition() {
        if (!this.error && this.data && this.data.latitude) {
            if (this.data.expiredDate >= new Date()) {
                return { state: 'success', data: this.data };
            } else {
                this.cancelWatchUserPosition();
                this.initWatchPosition();
                return {state: 'refresh', data: null};
            }
        } else {
            this.initWatchPosition();
            return { state: 'error', data: this.errorStatus };
        }
    }

    cancelWatchUserPosition() {
        if (this.watchPositionId) {
          navigator.geolocation.clearWatch(this.watchPositionId);   
        }
       
    }


    manageWatchPosition() {
        if (this.manageWatchPositionStarted) {
            this.manageWatchPositionStarted = true;
            document.addEventListener('visibilitychange', () => this.handleVisibilityChange(), false);  
        }
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.cancelWatchUserPosition();
        } else {
            this.initWatchPosition();
        }
    }
}