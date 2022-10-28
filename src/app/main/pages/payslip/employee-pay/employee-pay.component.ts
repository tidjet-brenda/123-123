import { Component, OnInit, Input } from '@angular/core';
import { PayService } from 'app/main/services/pay.service';
import { MatDialog } from '@angular/material/dialog';
import { SidebareComponent } from './sidebare/sidebare.component';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { ReferentielService } from 'app/main/services/referentiel.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
@Component({
  selector: 'app-employee-pay',
  templateUrl: './employee-pay.component.html',
  styleUrls: ['./employee-pay.component.scss']
})
export class EmployeePayComponent implements OnInit {
  @Input() user: any;
  @Input() payLines: any[];
  @Input() month: any;
  @Input() year: any;
  @Input() payInfoEMployee: any = [];

  companyId: any;
  data: any;
  width: any;
  height: any;
  isMobile: boolean;
  employeePay: any;

  constructor(private payService: PayService,
    private dialog: MatDialog,
    private refService: ReferentielService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.companyId = StorageUtils.getEmployeeCompanyId();
  }

  ngOnInit(): void {
    this.getScreenSize();
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
  }

  // format numbers
  currencyFormat(num, pos?) {
    if (num) {
      if (!pos) { pos = 2; }
      return (Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    } else {
      return 0;
    }
  }

  getCommune(code) {
    const commune: any = this.refService.getLocalComune(code);
    return commune ? commune.name : '/';
  }
  getWilaya(code) {
    const wilaya: any = this.refService.getLocalWilaya(code);
    return wilaya ? wilaya.name : '/';
  }
  printFile() {
    this.payService.notifyPrintFunc();
  }

  dowloadFile() {
    this.payService.notifyDownloadFunc();
  }
  getScreenSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.width < 700) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
  }
  selectRow(row: any) {
    this.getScreenSize();
    if (!this.isMobile && row.order >= 0) {
      let selectedPay = row;
      const payDetails = this.dialog.open(SidebareComponent, { data: { selectedPay } });
      payDetails.afterClosed().subscribe(result => {
        if (result && result === true) {
          selectedPay = null;
        }
      });
    }
  }
}
