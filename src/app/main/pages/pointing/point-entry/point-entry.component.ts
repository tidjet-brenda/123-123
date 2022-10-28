import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PointingService } from 'app/main/services/pointing.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { QrCodePointing } from 'app/main/shared/models/qrCodePointing.model';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from './../i18n/fr';
import { locale as dz } from './../i18n/dz';
import { Platform } from '@angular/cdk/platform';
import { GeolocationService } from 'app/main/services/geolocation.service';
@Component({
    selector: 'app-point-entry',
    templateUrl: './point-entry.component.html',
    styleUrls: ['./point-entry.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class PointEntryComponent implements OnInit {
    isMobile: boolean;
    entry: boolean;
    hasDevices = false;
    qrCodeValue = '';
    entryType: string;
    data: QrCodePointing = {
        entryType: null,
        latitude: null,
        longitude: null,
        expiredDate: null
    };
    companyId: any;
    noQrcode = false;
    successPoint = false;
    setLine: boolean;
    isScanned = false;
    isGreenBorder = false;
    firstTime = true;
    error = false;
    geolocateNotSupported: string;
    errorCode: any;
    scannerEnabled = true;
    cameraInit: boolean;
    exited = false;
    watchPositionId: number;
    getPositionStatus = 'GET_POSITION';
    scanTimeout: any;
    constructor(
        private route: Router,
        private pointingService: PointingService,
        private fuseTraslationService: FuseTranslationLoaderService,
        private translateService: TranslateService,
        private platform: Platform,
        private geolocationService: GeolocationService
    ) {
        if (!platform.IOS) {
            this.scannerEnabled = false;
        }
        this.fuseTraslationService.loadTranslations(fr, dz);
        this.isMobile = this.platform.ANDROID || this.platform.IOS;
        this.companyId = StorageUtils.getEmployeeCompanyId();
        const nodes = route.url.split('/');
        this.entry = nodes[nodes.length - 1].includes('entry');
        this.data.entryType = this.entry ? 'ENTRANCE' : 'EXIT';
        this.entryType = (this.data.entryType === 'ENTRANCE' ? 'Entrée' : 'Sortie');
    }

    ngOnInit(): void {
        this.fuseTraslationService.loadTranslations(fr, dz);
        if (this.isMobile) {
            this.verifyIfGetPositionisNotDenied();
        }
    }

    // tslint:disable-next-line: use-lifecycle-interface
    ngOnDestroy(): void {
        this.exited = true;
        if (!this.platform.IOS) {
            this.scannerEnabled = false;
        }
    }

    /**
     * QrCode not Detected TimeOut
     */
    isQrCodeDetectedTimeOut() {
        const scanTimeout = setTimeout(() => {
            if (this.qrCodeValue === '' && (!this.error || this.scannerEnabled)) {
                this.noCodeGesture();
            }
        }, 15000);
    }

    /**
     *  on get qr code
     * @param resultString qr code
     */
    onCodeResult(resultString: string) {
        if (this.firstTime) {
            this.qrCodeValue = resultString;
            this.isScanned = true;
            this.setLine = false;
            this.getUserPosition();
            this.firstTime = false;
        }
    }

    /**
     * get user current position
     */
    getUserPosition() {
        let infos = this.geolocationService.getUserPosition();
        switch (infos.state) {
            case 'success':
                this.data.latitude = infos.data.latitude;
                this.data.longitude = infos.data.longitude;
                this.setPointings();
                break;

            case 'error':
                this.errorCode = infos.data;
                this.error = true;
                clearTimeout(this.scanTimeout);
                this.scanTimeout = null;
                this.vibrateDevice();
                break;
            case 'refresh':
                setTimeout(() => {
                    this.getUserPosition();
                }, 3000);
        }
    }

    /**
     * set my pointing
     */
    setPointings() {
        this.animateGetPositionStatus();
        this.getPositionStatus = 'GET_POSITION';
        delete (this.data.expiredDate);
        setTimeout(() => {
            this.pointingService.postPointing(this.companyId, this.qrCodeValue, this.data).subscribe(result => {
                this.playAudio();
                this.successPoint = true;
            }, err => {
                this.errorCode = err.status !== 400 ? 'notvalid' : err.error.errorKey;
                this.error = true;
                clearTimeout(this.scanTimeout);
                this.scanTimeout = null;
                this.vibrateDevice();
            });
        }, 2000);

    }


    /**
     * on camera device get
     * @param devices list of devices
     */
    camerasFoundHandler(devices) {
        if (devices && devices.length) {
            setTimeout(() => {
                this.cameraInit = true;
            }, 500);
            this.hasDevices = true;
        }
    }

    /**
     * permission on camera gesture
     */
    navigatorPermissioForCamera() {
        if (!this.platform.IOS) {
            this.scannerEnabled = true;
        }
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'camera' }).then((permission) => {
                this.setLine = permission.state === 'granted';
                permission.onchange = (e) => {
                    const target: any = e.target;
                    this.setLine = target.state === 'granted';
                };
            });
        }
    }


    /**
     * retry scan and reset all variables
     */
    action(status) {
        switch (status) {
            case 0:
                setTimeout(() => {
                    this.retry();
                }, 1000);
                break;
            case 1:
                this.getPositionStatus = 'GET_POSITION';
                this.errorCode = null;
                this.error = false;
                this.getUserPosition();
                break;
            case 2:
                window.location.reload();
                break;
        }
    }

    /**
     * if scan error
     * @param error event
     */
    scanErrorHandler(error) {
        this.errorCode = error;
        this.error = true;
        clearTimeout(this.scanTimeout);
        this.scanTimeout = null;
        this.vibrateDevice();
    }

    /**
     * scan failed gesture
     * @param event event
     */
    scanFailureHandler(event) {
        if (event) {
            this.cameraInit = true;
        }
    }

    /**
     * if no scan code after timeout
     */
    noCodeGesture() {
        if (!this.platform.IOS) {
            this.scannerEnabled = false;
        }
        this.errorCode = 'noQrCode';
        this.error = true;
        clearTimeout(this.scanTimeout);
        this.scanTimeout = null;
        this.vibrateDevice();
    }

    /**
     * vibrate if scan failed
     */
    vibrateDevice() {
        if (!this.exited) {
            window.navigator.vibrate(200);
        }
    }

    /**
     * play audio if scan succes
     */
    playAudio() {
        if (!this.exited) {
            const audio = new Audio();
            audio.src = '../../../../../assets/songs/exquisite-557.mp3';
            audio.load();
            audio.play();
        }
    }

    /**
     * animate get position treatement
     */
    animateGetPositionStatus() {
        this.getPositionStatus = 'GET_POSITION';
        if (!this.platform.IOS) {
            this.scannerEnabled = false;
        }
        setTimeout(() => {
            this.getPositionStatus = 'TREAT_POSITION';
            setTimeout(() => {
                this.getPositionStatus = 'SEND_POSITION';
            }, 500);
        }, 500);
    }


    /**
     * go to all my pointing list
     */
    goToPointings() {
        if (!this.platform.IOS) {
            this.scannerEnabled = false;
        }
        this.route.navigate(['/pointing/my-pointings']);
    }

    /**
     * verify If Get Position is Not Denied
     */
    verifyIfGetPositionisNotDenied() {
        const _this = this;
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then((permissionStatus) => {
                if (permissionStatus && permissionStatus.state !== 'granted') {
                    this.geolocationPermissionDenied();
                    this.geolocationService.initWatchPosition();
                } else {
                    this.navigatorPermissioForCamera();
                    this.isQrCodeDetectedTimeOut();
                }
                permissionStatus.onchange = function () {
                    if ((!_this.isScanned && _this.errorCode !== 'noQrCode')) {
                        if (this.state !== 'granted') {
                            _this.geolocationPermissionDenied();
                        } else {
                            _this.retry();
                        }
                    }

                };
            });
        }

    }

    geolocationPermissionDenied() {
        if (!this.platform.IOS) {
            this.scannerEnabled = false;
        }
        clearTimeout(this.scanTimeout);
        this.scanTimeout = null;
        this.errorCode = 'positionPermissionDenied';
        this.error = true;
        this.vibrateDevice();
    }

    retry() {
        this.scanTimeout = false;
        this.qrCodeValue = '';
        this.noQrcode = false;
        this.successPoint = false;
        this.setLine = true;
        this.isScanned = false;
        this.isGreenBorder = false;
        this.firstTime = true;
        this.error = false;
        this.errorCode = null;
        if (!this.platform.IOS) {
            this.scannerEnabled = false;
        }
        this.cameraInit = false;
        clearTimeout(this.scanTimeout);
        this.ngOnInit();
    }

}