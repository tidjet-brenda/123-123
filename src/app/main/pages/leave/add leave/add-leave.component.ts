import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LeavesService } from 'app/main/services/leaves.service';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-demander-absence',
  templateUrl: './add-leave.component.html',
  styleUrls: ['./add-leave.component.scss']
})
export class AddLeaveComponent implements OnInit {
  leaveForm: FormGroup;
  exercises: any[];
  companyId: any;
  durationError: string;
  minDate = new Date();

  dateControl = new FormControl(null, Validators.required);
  beginDateControl = new FormControl(null, Validators.required);
  endDateControl = new FormControl(null, Validators.required);
  halfDayBeginDateControl = new FormControl(null);
  halfDayEndDateControl = new FormControl(null);
  durationControl = new FormControl({ value: null, disabled: true });
  exerciseControl = new FormControl({ value: null, disabled: true });
  noteControl = new FormControl(null);
  leaveSoldControl = new FormControl(null);
  duration: number;

  leaveId: number;
  editing: boolean;
  leave: any;
  width: any;
  isMobile: any;
  loadingButton: boolean;
  page = 0;

  constructor(private formBuilder: FormBuilder,
    private router: Router, private route: ActivatedRoute,
    private leaveService: LeavesService,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.route.params.subscribe(prms => {
      if (prms.id) {
        this.leaveId = +prms.id;
        this.route.queryParams.subscribe(qps => {
          if (this.leaveId) {
            this.editing = true;
          } else {
            this.editing = false;
          }
        });
      }
    });
    this.route.queryParams.subscribe(params => {
      this.page = params.page ? params.page : 0;
    });
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.getExercises();
  }

  ngOnInit(): void {
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
    this.getScreenSize();
    this.initForm();
    this.getExercises();
  }

  initForm() {
    this.leaveForm = this.formBuilder.group({
      duration: this.durationControl,
      exercises: this.exerciseControl,
      beginDate: this.beginDateControl,
      halfDayInBeginDate: this.halfDayBeginDateControl,
      endDate: this.endDateControl,
      halfDayInEndDate: this.halfDayEndDateControl,
      note: this.noteControl,
      withoutPay: this.leaveSoldControl
    });
  }

  dateChanged(event) {
    if (this.beginDateControl.value && this.endDateControl.value) {
      const begin = moment(this.beginDateControl.value);
      const end = moment(this.endDateControl.value);
      if (begin.isSame(end)) {
        this.halfDayEndDateControl.setValue(false);
        this.halfDayEndDateControl.disable();
      } else {
        this.halfDayEndDateControl.enable();
      }
      this.setDuration(begin, end);
    }
  }
  goBack() {
    this.router.navigate(['leave'], { queryParams: { page: this.page } });
  }

  getExercises() {
    this.leaveService.getExercise(this.companyId, true).subscribe(result => {
      this.exercises = result;
      if (this.leaveId) {
        this.getSingleLeave();
      } else if (this.getRemaining() === 0) {
        this.snackBarService.showSnackBar(this.translateService.instant('leave.noRemainningDays'),
          this.snackBarService.errorSnackBarClass);
      }
    });
  }

  getSingleLeave() {
    this.leaveService.getLeaveById(this.companyId, this.leaveId).subscribe(result => {
      this.leave = result;
      this.leave.exercises = this.leave.takenLeaves.map(takenLeave => takenLeave.leaveYear).join(', ');
      this.setValues(this.leave);
    });
  }

  createLeave() {
    if (this.leaveForm.valid) {
      this.loadingButton = true;
      const leave: any = {
        beginDate: moment((this.leaveForm.get('beginDate').value)).format('YYYY-MM-DD'),
        halfDayInBeginDate: this.halfDayBeginDateControl.value,
        endDate: moment((this.leaveForm.get('endDate').value)).format('YYYY-MM-DD'),
        halfDayInEndDate: this.halfDayEndDateControl.value,
        duration: moment((this.leaveForm.get('beginDate').value).end).diff(moment((this.leaveForm.get('endDate').value).begin)
          , 'days'),
        status: 'WAITING',
        withoutPay: this.leaveForm.get('withoutPay').value
      };
      if (this.leaveId) {
        leave.id = this.leaveId;
        this.leaveService.updateRequestLeave(this.companyId, leave).subscribe(res => {
          this.loadingButton = false;
          this.goBack();
          this.snackBarService.showSnackBar(this.translateService.instant('leave.updateSuccessMsg'),
            this.snackBarService.succesSnackBarClass);
        }, err => {
          this.loadingButton = false;
        });
      } else {
        this.leaveService.createRequestLeave(this.companyId, leave).subscribe(res => {
          this.loadingButton = false;
          this.snackBarService.showSnackBar(this.translateService.instant('leave.leaveRequestAddedSuccessMsg'),
            this.snackBarService.succesSnackBarClass);
          this.goBack();
        }, err => {
          this.loadingButton = false;
        });
      }
    } else {
      this.leaveForm.markAllAsTouched();
    }
  }


  resetForm() {
    this.leaveForm.reset();
    this.goBack();
  }
  setDuration(begin, end) {
    this.duration = moment.duration(end.diff(begin)).asDays() + 1;
    this.duration = this.halfDayBeginDateControl.value ? this.duration - 0.5 : this.duration;
    this.duration = this.halfDayEndDateControl.value ? this.duration - 0.5 : this.duration;
    if (this.duration > 0) {
      this.checkRemainingDays(this.duration);
      this.durationControl.setValue(this.duration + this.translateService.instant('leave.days'));
    } else {
      this.durationControl.setValue(null);
      this.exerciseControl.setValue(null);
    }
  }

  checkRemainingDays(duration) {
    if (this.getRemaining() < duration) {
      this.exerciseControl.setValue(null);
      this.endDateControl.setErrors({ enoughRemainingDays: true });
    } else {
      this.endDateControl.setErrors(null);
      const exercisesValues = [];
      for (const exercice of this.exercises) {
        let remainingInExercice = exercice.remaining;
        exercice.takenLeaves.forEach(takenLeave => {
          if (takenLeave.leaveRequestId !== this.leaveId) {
            remainingInExercice -= takenLeave.duration;
          }
        });
        if (remainingInExercice) {
          exercisesValues.push(exercice.year);
        }
        duration = duration - remainingInExercice;
        if (duration <= 0) {
          break;
        }
      }
      this.exerciseControl.setValue(exercisesValues.join(', '));
    }
  }

  getRemaining() {
    let remainingInExercices = 0;
    let waitingRequestsCountDays = 0;
    this.exercises.forEach(exercice => remainingInExercices += exercice.remaining);
    this.exercises.forEach(exercice => {
      exercice.takenLeaves.forEach(takenLeave => {
        if (takenLeave.leaveRequestStatus === 'WAITING' && this.leaveId !== takenLeave.leaveRequestId) {
          waitingRequestsCountDays += takenLeave.duration;
        }
      });
    });

    return remainingInExercices - waitingRequestsCountDays;
  }

  toggleChanged(event) {
    this.setDuration(moment(this.beginDateControl.value), moment(this.endDateControl.value));
  }
  setValues(values) {
    this.leaveForm.controls.beginDate.setValue(values.beginDate);
    this.leaveForm.controls.endDate.setValue(values.endDate);
    this.leaveForm.controls.halfDayInBeginDate.setValue(values.halfDayInBeginDate);
    this.leaveForm.controls.halfDayInEndDate.setValue(values.halfDayInEndDate);
    this.leaveForm.controls.duration.setValue(values.duration + this.translateService.instant('leave.days'));
    this.leaveForm.controls.exercises.setValue(values.exercises);
    this.leaveForm.controls.withoutPay.setValue(values.withoutPay);
    if (this.editing && values.withoutPay) {
      this.leaveForm.controls.withoutPay.disable();
    }
  }

  getScreenSize() {
    this.width = window.innerWidth;
    if (this.width < 600) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
}
