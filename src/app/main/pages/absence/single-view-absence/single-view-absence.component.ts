import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AbsenceService } from 'app/main/services/absence.service';
import { UserService } from 'app/main/services/user.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { environment } from 'environments/environment';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { PopupSirh } from 'app/main/shared/components/popUp/popup-sirh.component';
@Component({
  selector: 'app-single-view-absence',
  templateUrl: './single-view-absence.component.html',
  styleUrls: ['./single-view-absence.component.scss']
})
export class SingleViewAbsenceComponent implements OnInit {
  absenceId: any;
  absence: any;
  companyId: any;
  concernedExercise: any;
  fullName: string;
  selectedTab = 0;
  duration: any;
  status: any;
  attachementUrl: any;
  page = 0;

  constructor(private route: ActivatedRoute,
    private absenceService: AbsenceService,
    private router: Router,
    private userService: UserService,
    public dialog: MatDialog,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService,
    private location: Location) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.route.params.subscribe(prms => {
      if (prms.id) {
        this.absenceId = +prms.id;
      }
    });
    this.route.queryParams.subscribe(params => {
      this.page = params.page ? params.page : 0;
    });
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.getSingleAsence();
  }

  ngOnInit(): void {
    this.getAttachementUrl();
  }

  getSingleAsence() {
    this.absenceService.getAbsenceById(this.companyId, this.absenceId).subscribe(result => {
      this.absence = result;
      this.setDuration(this.absence.startDate, this.absence.endDate, this.absence.halfDayInBeginDate, this.absence.halfDayInEndDate);
      this.fullName = this.absence.employeeLastName + ' ' + this.absence.employeeFirstName;
    });
  }

  editWaitingLeave() {
    this.router.navigate(['absence', this.absence.id, 'edit'], { queryParams: { page: this.page } });
  }
  goBack() {
    this.router.navigate(['absence'],
      { queryParams: { selectedTab: this.selectedTab, page: this.page } });
  }
  setDuration(beginDate, endDate, isHalfBDay, isHalfEDay) {
    const cre = moment(beginDate);
    const end = moment(endDate);
    this.duration = moment.duration(end.diff(cre)).asDays() + 1;
    if (isHalfBDay) {
      this.duration = this.duration - 0.5;
    }
    if (isHalfEDay) {
      this.duration = this.duration - 0.5;
    }
    if (this.duration > 0) {
      this.duration = this.duration + ' jours';
    } else {
      this.duration = this.duration + ' jour';
    }
  }

  deleteAbsence(status?) {
    const message = status ?
      this.translateService.instant('absence.ConfirmDeleteMsg') :
      this.translateService.instant('absence.ConfirmCancelRequestMsg');
    const options = [
      { text: this.translateService.instant('absence.true'), value: true },
      { text: this.translateService.instant('absence.false'), value: false }
    ];
    const deletePopUp = this.dialog.open(PopupSirh, { data: { options, message } });
    deletePopUp.afterClosed().subscribe(res => {
      if (res && res === true) {
        if (status) {
          this.absenceService.deleteAbsenceRequest(this.companyId, this.absenceId).subscribe(resS => {
            this.afterDeleteOrCancelRequest(status);
          });
        } else {
          this.afterDeleteOrCancelRequest(status);
        }

      }
    });
  }

  updateAbsence() {
    this.editWaitingLeave();
  }

  getAttachementUrl() {
    this.attachementUrl = environment.ENDPOINTS.EMPLOYEE_ATTACHEMENT_URL;
  }

  stringValue(value: boolean): string {
    if (value) {
      return 'true';
    } else {
      return 'false';
    }
  }
  afterDeleteOrCancelRequest(status) {
    this.snackBarService.showSnackBar(
      status ? this.translateService.instant('absence.absenceRequestDeleted') :
        this.translateService.instant('absence.absenceRequestToCancel')
      , this.snackBarService.succesSnackBarClass);
      this.location.back();
  }
} 
