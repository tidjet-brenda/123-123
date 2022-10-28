import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import _moment from 'moment';
import { default as _rollupMoment, Moment } from 'moment';
import { FormControl } from '@angular/forms';
import { PayService } from 'app/main/services/pay.service';
import * as html2pdf from 'html2pdf.js';
import { UserService } from 'app/main/services/user.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
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
  selector: 'app-payslip',
  templateUrl: './payslip.component.html',
  styleUrls: ['./payslip.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class PayslipComponent implements OnInit, OnDestroy {
  date = new FormControl(null);
  month: string;
  row: any;
  year: string;
  monthYear: string;
  companyId: any;
  payInfoEMployee: any = {};
  payLines: any[];
  maxDate = new Date();
  user: any = {};
  width: number;
  height: number;
  isMobile: boolean;
  startDate: string;
  lastDate: string;
  r1 = [];
  r15 = [];
  r2 = [];
  r3 = [];
  linesToShow = [];
  payrollSectionList = [];

  constructor(private payService: PayService, private userService: UserService,
    private translateService: TranslateService, private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.companyId = StorageUtils.getEmployeeCompanyId();
  }

  ngOnInit(): void {
    const monthYear = StorageUtils.getMonthYear();
    if (monthYear) {
      this.date.setValue(moment(monthYear));
    } else {
      const date = new Date(new Date().setMonth(new Date().getMonth() - 1));
      this.date.setValue(moment(new Date(date)));
    }
    this.getSelectedMonth();
    this.getSelectedMonthYear();
    this.getPay();
    this.userService.getUserInfo().subscribe(result => {
      StorageUtils.setUser(result);
      this.user = result;
    });
    this.payService.notifyPrint$.subscribe(res => {
      this.printFile();
    });
    this.payService.monthDownloadFileNotify$.subscribe(result => {
      this.downloadPayFile();
    });
    this.getScreenSize();
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
  }

  ngOnDestroy(): void {
    StorageUtils.removeMonthYear();
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
    this.getPay();
    this.getSelectedMonthYear();
  }

  getSelectedMonth() {
    this.month = moment(this.date.value).locale('fr').format('MMMM');
    this.month = this.month.substr(0, 1).toUpperCase() + this.month.substr(1, this.month.length);
  }

  getSelectedMonthYear() {
    this.year = this.date.value.year();
    const year = this.date.value.year();
    let month = this.date.value.month() + 1;
    month = month < 10 ? '0' + month : month;
    this.monthYear = year + '-' + month;
    StorageUtils.setMonthYear(this.monthYear);
    this.row = null;
    this.startDate = '01/' + month + '/' + year;
    this.lastDate = new Date(+year, +month + 1, 0).getDate() + '/' + month + '/' + year;
  }

  getPay() {
    [this.r1, this.r15, this.r2, this.r3, this.linesToShow] = [[], [], [], [], []];
    this.getSelectedMonthYear();
    this.payService.getPay(this.companyId, this.monthYear).subscribe(result => {
      this.payInfoEMployee = result.length > 0 ? result[0] : [];
      if (this.payInfoEMployee && this.payInfoEMployee.employeePayLines) {
        this.payLines = this.payInfoEMployee.employeePayLines.filter(pay => pay.gain || pay.deduction || (pay.valueSource === 'LEAVE')
          || pay.contributoryPayrollSection || pay.taxablePayrollSection).forEach(element => {
            element.empty = !element.gain && !element.deduction;
            if (element.contributoryPayrollSection) {
              this.r1.push(element);
            } else if (element.valueSource === 'LEAVE') {
              this.r15.push(element);
            } else if (element.taxablePayrollSection) {
              this.r2.push(element);
            } else {
              this.r3.push(element);
            }
          });
        this.linesToShow = this.linesToShow.concat(this.r1);
        this.linesToShow = this.linesToShow.concat(this.r15);
        this.linesToShow.push({ order: -3, name: '8', value: this.payInfoEMployee.nationalSocialInsuranceFund });
        this.linesToShow.push({ order: -4, name: '11', value: this.payInfoEMployee.cacobatph });
        this.linesToShow = this.linesToShow.concat(this.r2);
        this.linesToShow.push({ order: -2, name: '9', value: this.payInfoEMployee.overallIncomeTax });
        this.linesToShow = this.linesToShow.concat(this.r3);
        console.log('linesToShow', this.linesToShow);
      }
      StorageUtils.setMonthPay(this.payInfoEMployee);
    });
  }
  printFile() {
    setTimeout(() => {
      document.title = 'Fiche de paie - ' + this.payInfoEMployee.employeeLastName + ' ' + this.payInfoEMployee.employeeFirstName +
        ' - ' + this.monthYear;
      window.print();
    }, 1000);
    window.onafterprint = () => {
      document.title = 'SIRH | Month pay';
    };
  }


  downloadPayFile() {
    const options = {
      margin: [10, 10, 10, 10],
      filename: 'Fiche de paie du mois de ' + ' ' + this.month,
      html2canvas: {},
      image: { type: 'jpeg' },
      jsPDF: { orientation: 'p', unit: 'mm', format: 'a4' }
    };
    const content = document.getElementById('export-content');

    html2pdf()
      .from(content)
      .set(options)
      .save();
  }

  getScreenSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.width < 860) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
}
