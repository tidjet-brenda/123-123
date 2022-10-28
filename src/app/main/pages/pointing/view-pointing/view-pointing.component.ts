
import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/main/services/user.service';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { PointingService } from 'app/main/services/pointing.service';
import { ActivatedRoute, Router } from '@angular/router';
import { locale as fr } from './../i18n/fr';
import { locale as dz } from './../i18n/dz';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-view-pointing',
  templateUrl: './view-pointing.component.html',
  styleUrls: ['./view-pointing.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ViewPointingComponent implements OnInit {
  user: any;
  columns: any;
  rows: any[];
  unite: any;
  row: any;
  monthYear: string;
  companyId: any;
  datePointing: any;
  dayNumber: any;
  date = new FormControl(moment());
  month: any;
  totalItems: any;
  pageCount: number;
  pageIndex: number;
  maxDate = moment(new Date());
  height: any;
  width: any;
  isMobile: boolean;
  displayYear: any;
  isPointing: boolean;
  constructor(private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private pointingService: PointingService,
    private fuseTraslationService: FuseTranslationLoaderService,
    private translateService: TranslateService) {
    this.fuseTraslationService.loadTranslations(fr, dz);
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params.page ? params.page - 1 : 0;
    });
  }
  ngOnInit(): void {
    this.initTable();
    this.getUserInfo();
    this.getSelectedMonth();
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
  }
  getScreenSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.width < 340) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  getUserInfo() {
    this.userService.getUserInfo().subscribe(result => {
      this.user = result;
      this.companyId = this.user.companyId;
      this.getPointing();
      this.user.diplomaes.forEach(diplome => {
        this.user.allDiplomes = this.user.allDiplomes + ' ' + diplome;
      });
    });
  }

  chosenYearHandler(normalizedYear: Moment) {
    const ctrlValue = this.date.value;
    ctrlValue.year(normalizedYear.year());
    this.date.setValue(ctrlValue);
  }

  chosenMonthHandler(normalizedMonth: Moment, datepicker: MatDatepicker<Moment>) {
    const ctrlValue = this.date.value;
    ctrlValue.month(normalizedMonth.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
    this.getSelectedMonth();
    this.getPointing();
  }

  getSelectedMonth() {
    this.month = moment(this.date.value).locale('fr').format('MMMM');
  }

  getSelectedMonthYear() {
    const year = this.date.value.year();
    let month = this.date.value.month() + 1;
    month = month < 10 ? '0' + month : month;
    this.monthYear = year + '-' + month;
    this.row = null;
    this.displayYear = year;
  }

  initTable() {
    this.columns = [{
      name: 'entries',
      prop: 'entrance'
    }, {
      name: 'exits',
      prop: 'exit'
    }, {
      name: 'nbrHours',
      prop: 'duration'
    }];
    this.pageCount = 20;
    //  this.pageIndex = 0;
    
    this.unite = this.translateService.instant('pointing.unite');
  }

  getPointing() {
    this.pageIndex = 0;
    this.getSelectedMonthYear();
    this.pointingService.getDayPointing(this.companyId, this.monthYear).subscribe(result => {
      this.rows = result;
      this.rows.length === 0 ? this.isPointing = false : this.isPointing = true;
      this.totalItems = result.length;
      this.rows.forEach(pointing => {
        pointing.entrance = moment(pointing.entrance).local().format('DD/MM/YYYY HH:mm');
        pointing.exit = pointing.exit !== null ? moment(pointing.exit).local().format('DD/MM/YYYY  HH:mm') : '';
        const hours = Math.trunc(pointing.durationInMinutes / 60);
        const minutes = pointing.durationInMinutes % 60;
        pointing.duration = (hours !== 0 ? hours + 'H' : '') + (minutes !== 0 ? minutes + 'MIN' : '');
      });
      const days = new Set(result.map(pointing => pointing.entrance.substr(0, 10)));
      this.dayNumber = days.size;
      this.dayNumber = this.dayNumber + (this.dayNumber !== 1 ?  this.translateService.instant('pointing.days')
       :  this.translateService.instant('pointing.day'));
    });
    setTimeout(() => {
      document.getElementById('main').click();
    }, 100);
  }


  formatTime(time: string) {
    const hours = time.substr(0, 2);
    const days = time.substr(3, 2);
    return hours + ':' + days;
  }

}