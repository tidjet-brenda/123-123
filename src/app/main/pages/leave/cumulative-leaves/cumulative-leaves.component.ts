import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeavesService } from 'app/main/services/leaves.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-cumulative-leaves',
  templateUrl: './cumulative-leaves.component.html',
  styleUrls: ['./cumulative-leaves.component.scss']
})
export class CumulativeLeavesComponent implements OnInit {

  pageIndex: any;
  pageCount: any;
  columns: any;
  @Input() rows = [];
  unite: any;
  actions: any;
  status: any;
  totalItems: any;
  companyId: any;
  errorSnackBarClass = 'error-snackbar';
  width: any;
  height: any;
  isMobile: boolean;

  constructor(
    private leaveService: LeavesService,
    private route: ActivatedRoute,
    private router: Router,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.getScreenSize();
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params.page ? params.page - 1 : 0;
    });
  }

  ngOnInit(): void {
    this.initTable();
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
    this.getLeaves();
  }

  initTable() {
    //  this.pageIndex = 0;
    this.pageCount = 10;
    if (this.isMobile) {
      this.columns = [
        { name: 'period', prop: 'year', sortable: false },
        { name: 'accumulated', prop: 'accumulated', sortable: true },
        { name: 'taken', prop: 'taken', sortable: true },
        { name: 'remaining', prop: 'remaining', sortable: true },
      ];
    } else {
      this.columns = [
        { name: 'refPeriod', prop: 'year', sortable: false },
        { name: 'accumulated', prop: 'accumulated', sortable: true },
        { name: 'consommed', prop: 'taken', sortable: true },
        { name: 'remaining2', prop: 'remaining', sortable: true },
      ];
    }
    this.unite =  this.translateService.instant('leave.cumulatedLeaves');
  }

  getLeaves() {
    this.rows.forEach(element => {
      element.takenRemaining = element.taken + '/' + element.remaining;
    });
  }

  getScreenSize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    if (this.width < 600) {
      this.isMobile = true;
    } else {
      this.isMobile = false;
    }
    this.initTable();
  }
}
