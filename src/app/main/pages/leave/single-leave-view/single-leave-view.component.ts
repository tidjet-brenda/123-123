import { MatDialog } from '@angular/material/dialog';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeavesService } from 'app/main/services/leaves.service';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { PopupSirh } from 'app/main/shared/components/popUp/popup-sirh.component';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-single-leave-view',
  templateUrl: './single-leave-view.component.html',
  styleUrls: ['./single-leave-view.component.scss']
})
export class SingleLeaveViewComponent implements OnInit {

  congeId: any;
  leave: any;
  companyId: any;
  concernedExercise: any;
  waitingToCancel = false;
  page = 0;
  readWithoutPay: any;
  constructor(private route: ActivatedRoute,
    private leaveService: LeavesService,
    private snackBarService: SnackBarService,
    private dialog: MatDialog,
    private router: Router,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.route.params.subscribe(prms => {
      if (prms.id) {
        this.congeId = +prms.id;
      }
    });
    this.route.queryParams.subscribe(params => {
      this.page = params.page ? params.page : 0;
    });
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.getSingleLeave();
  }

  ngOnInit(): void { }

  getSingleLeave() {
    this.leaveService.getLeaveById(this.companyId, this.congeId).subscribe(result => {
      this.readWithoutPay = result.withoutPay ? this.translateService.instant('leave.yes') : this.translateService.instant('leave.no');
      this.leave = result;
      this.leave.duration = this.leave.duration + this.translateService.instant('leave.days');
      this.concernedExercise = this.leave.takenLeaves.map(takenLeave => takenLeave.leaveYear).join(', ');
    });

  }

  editWaitingLeave() {
    this.router.navigate(['leave', this.leave.id, 'edit'], { queryParams: { page: this.page } });
  }

  deleteLeave(delet) {
    const message = delet ? this.translateService.instant('leave.deleteLeaveMsg'):
    this.translateService.instant('leave.cancelLeaveMsg');
    const options = [
      { text: this.translateService.instant('leave.yes'), value: true },
      { text: this.translateService.instant('leave.no'), value: false }
    ];
    const deletePopUp = this.dialog.open(PopupSirh, { data: { options, message } });
    deletePopUp.afterClosed().subscribe(res => {
      if (res && res === true) {
        if (delet) {
          this.leaveService.deleteLeaveRequest(this.companyId, this.congeId).subscribe(resS => {
            this.snackBarService.showSnackBar(this.translateService.instant('leave.deletedLeaveRequest'),
             this.snackBarService.succesSnackBarClass);
            this.goBack();
          });
        } else {
          this.leaveService.askToCancelAcceptedLeaveRequest(this.companyId, this.congeId).subscribe(result => {
            this.snackBarService.showSnackBar(this.translateService.instant('leave.canceledLeaveRequest')
              , this.snackBarService.succesSnackBarClass);
            this.goBack();
          });
        }
       
      }
    });
  }

  goBack() {
    this.router.navigate(['leave'], { queryParams: { page: this.page } });
  }

  updateLeave() {
    this.getSingleLeave();
    this.editWaitingLeave();
  }
}
