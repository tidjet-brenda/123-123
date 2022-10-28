import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AbsenceService } from 'app/main/services/absence.service';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { DateTimeAdapter } from 'ng-pick-datetime';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-add-absence',
  templateUrl: './add-absence.component.html',
  styleUrls: ['./add-absence.component.scss']
})
export class AddAbsenceComponent implements OnInit {
  formGroup: FormGroup;
  justification: string;
  fileName: any;
  absence: any;
  file: any;
  absenceId: any;
  editing: boolean;
  selectedTab = 0;
  createSnackMessage = 'absence.createSnackMessage';
  updateSnackMessage = 'absence.updateSnackMessage';
  companyId: any;
  fromView = false;
  minDate = new Date();
  createDateControl = new FormControl(null, Validators.required);
  halfDayBeginDateControl = new FormControl(null);
  halfDayEndDateControl = new FormControl(null);
  endDateControl = new FormControl(null, Validators.required);
  reasonControl = new FormControl(null, Validators.required);
  otherReasonControl = new FormControl(null, Validators.required);
  noteControl = new FormControl(null);
  accountedControl = new FormControl(false, Validators.required);
  durationControl = new FormControl({ value: null, disabled: true });
  justifiedControl = new FormControl(false, Validators.required);
  statusControl = new FormControl('WAITING', Validators.required);
  weekendDays = [];
  reasons = [
    'ILLNESS', 'DEATH', 'MARRIAGE', 'BIRTH', 'OTHER'
  ];
  statusList = [
    'WAITING', 'ACCEPTED', 'DENIED'
  ];  
  duration: number;
  days: string;
  width: any;
  isMobile: boolean;
  weekendDaysIndex = [];
  weekendDaysCount = 0;
  loadingButton: boolean;
  page = 0;
  myFilter = (d: Date): boolean => {
    const day = new Date(d).getDay();
    return this.weekendDaysIndex && !this.weekendDaysIndex.includes(day);
  }
  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private absenceService: AbsenceService,
    private route: ActivatedRoute,
    private dateTimeAdapter: DateTimeAdapter<any>,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.route.params.subscribe(prms => {
      if (prms.id) {
        this.absenceId = +prms.id;
        this.route.queryParams.subscribe(qps => {
          if (this.absenceId) {
            this.editing = true;
          } else {
            this.editing = false;
          }
        });
      }
    });
    this.route.queryParams.subscribe(prms => {
      if (prms.startDate) {
        this.createDateControl.setValue(prms.startDate);
      }
      if (prms.fromView) {
        this.fromView = true;
      }
      this.page = prms.page ? prms.page : 0;
    });
    dateTimeAdapter.setLocale('fr');
  }

  ngOnInit(): void {
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
    this.getScreenSize();
    this.initForm();
    this.getCompanyWeekEndDays();
    if (this.absenceId) {
      this.getAbsence();
    }
  }

  goBack() {
    this.router.navigate(['absence'], { queryParams: { page: this.page } });
  }

  initForm() {
    this.formGroup = this.formBuilder.group({
      startDate: this.createDateControl,
      endDate: this.endDateControl,
      halfDayInBeginDate: this.halfDayBeginDateControl,
      halfDayInEndDate: this.halfDayEndDateControl,
      reason: this.reasonControl,
      accounted: this.accountedControl,
      duration: this.durationControl,
      note: this.noteControl,
      justified: this.justifiedControl,
    }, { validator: this.dateValidator });
    this.formGroup.controls.reason.valueChanges.subscribe(value=>{
     if (value === 'OTHER') {
       this.formGroup.addControl('otherReason', this.otherReasonControl);
     } else {
       if (this.formGroup.contains('otherReason')) {
        this.formGroup.removeControl('otherReason');
       }
     }
      
    });
  }

  dateValidator(formGroup: FormGroup): any | null {
    const startDateValidator = formGroup.get('startDate');
    const endDateValidator = formGroup.get('endDate');
    if (startDateValidator.value && endDateValidator.value) {
      if (moment(startDateValidator.value).isBefore(moment(endDateValidator.value)) ||
        moment(startDateValidator.value).isSame(moment(endDateValidator.value))) {
        return null;
      } else {
        endDateValidator.setErrors({ invalidDates: true });
        return { invalidDates: true };
      }
    } else {
      return { required: true };
    }
  }

  dateChanged() {
    if (this.createDateControl.value && this.endDateControl.value) {
      const begin = moment(this.createDateControl.value);
      const end = moment(this.endDateControl.value);
      if (begin.isSame(end)) {
        this.halfDayEndDateControl.setValue(false);
        this.halfDayEndDateControl.disable();
      } else {
        this.halfDayEndDateControl.enable();
      }
      this.weekendDaysCount = 0;
      this.weekendDays.forEach(day => {
        this.weekendDaysCount += this.absenceService.getdayCountBetweenDates(this.absenceService.getDayIndex(day),
          this.createDateControl.value, this.endDateControl.value);
      });
      this.setDuration(begin, end);
    }
  }

  setDuration(begin, end) {
    this.duration = moment.duration(end.diff(begin)).asDays() + 1 - this.weekendDaysCount;
    this.duration = this.halfDayBeginDateControl.value ? this.duration - 0.5 : this.duration;
    this.duration = this.halfDayEndDateControl.value ? this.duration - 0.5 : this.duration;
    if (this.duration > 0) {
      this.duration > 1 ? this.days = ' jours' : this.days = ' jour';
      this.durationControl.setValue(this.duration.toFixed(0) + this.days);
    } else {
      this.durationControl.setValue(null);
    }
  }

  toggleChanged(event) {
    this.setDuration(moment(this.createDateControl.value), moment(this.endDateControl.value));
  }



  createAbsence() {
    if (this.formGroup.valid) {
      this.loadingButton = true;
      const format = 'YYYY-MM-DD[T]HH:mm:ss';
      const absence = this.formGroup.value;
      absence.startDate = moment(this.createDateControl.value).format(format);
      absence.halfDayInBeginDate = this.halfDayBeginDateControl.value;
      absence.endDate = moment(this.endDateControl.value).format(format);
      absence.halfDayInEndDate = this.halfDayEndDateControl.value;
      absence.accounted = this.accountedControl.value;
      absence.reason = this.reasonControl.value;
      absence.otherReason = this.otherReasonControl.value;
      absence.status = this.statusList[0];
      absence.justified = this.justifiedControl.value;
      if (this.absenceId) {
        absence.id = this.absenceId;
      }
      // create form data
      const fd = new FormData();
      const str = JSON.stringify(absence);
      const file = new File([str], 'absence.json', { type: 'application/json' });
      fd.append('absence', file);
      if (this.file) {
        fd.append('justification', this.file);
      }

      if (this.absenceId) {
        this.absenceService.updateAbsence(this.companyId, this.absenceId, fd).subscribe(res => {
          this.loadingButton = false;
          this.snackBarService.showSnackBar(
            this.translateService.instant('absence.updateSnackMessage')
            , this.snackBarService.succesSnackBarClass);
          this.goBack();
        }, err => {
          this.loadingButton = false;
        });

      } else {
        this.absenceService.createAbsence(this.companyId, fd).subscribe(res => {
          this.loadingButton = false;
          this.snackBarService.showSnackBar(
            this.translateService.instant(this.createSnackMessage),
            this.snackBarService.succesSnackBarClass);
          this.goBack();
        }, err => {
          this.loadingButton = false;
        });
      }
    } else {
      this.formGroup.markAllAsTouched();
    }

  }

  resetForm() {
    this.initForm();
    this.formGroup.reset();
    this.router.navigate(['absence']);
  }

  onFileChange(event) {
    const reader = new FileReader();
    if (event.target.files && event.target.files.length) {
      const [file] = event.target.files;
      reader.readAsDataURL(file);
      this.fileName = file.name;
      this.file = file;
      reader.onload = () => {
        this.justification = reader.result as string;
      };
    }
  }

  getAbsence() {
    this.absenceService.getAbsenceById(this.companyId, this.absenceId).subscribe(res => {
      this.absence = res;
      this.createDateControl.setValue(this.absence.startDate);
      this.endDateControl.setValue(this.absence.endDate);
      this.halfDayBeginDateControl.setValue(this.absence.halfDayInBeginDate);
      this.halfDayEndDateControl.setValue(this.absence.halfDayInEndDate);
      this.reasonControl.setValue(this.absence.reason);
      this.otherReasonControl.setValue(this.absence.otherReason);
      this.accountedControl.setValue(this.absence.accounted);
      this.justifiedControl.setValue(this.absence.justified);
      this.statusControl.setValue(this.absence.status);
      if (!this.editing) {
        this.createDateControl.disable();
        this.endDateControl.disable();
        this.reasonControl.disable();
        this.otherReasonControl.disable();
        this.noteControl.disable();
        this.accountedControl.disable();
        this.justifiedControl.disable();
        this.statusControl.disable();
      }
      this.dateChanged();
      this.fileName = this.absence.attachmentFilename;
    });
  }

  clearFileName(event) {
    (document.getElementById('file') as HTMLInputElement).value = '';
    this.fileName = null;
    this.file = null;
  }

  toogleChange(event) {
    if (!event.checked) {
      this.justifiedControl.reset();
      this.fileName = null;
      this.file = null;
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

  getCompanyWeekEndDays() {
    this.absenceService.getCompanyWeekEndDays(this.companyId).subscribe((res: any[]) => {
      this.weekendDays = res;
      this.weekendDays.forEach(day => {
        this.weekendDaysIndex.push(this.absenceService.getDayIndex(day));
      });
    });
  }
}
