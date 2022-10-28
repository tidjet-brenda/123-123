import { Component, OnInit, Output, EventEmitter, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeavesService } from 'app/main/services/leaves.service';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import * as moment from 'moment';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { PopupSirh } from 'app/main/shared/components/popUp/popup-sirh.component';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
@Component({
  selector: 'app-view-all-leave',
  templateUrl: './view-all-leave.component.html',
  styleUrls: ['./view-all-leave.component.scss']
})
export class ViewAllLeaveComponent implements OnInit {
  pageIndex: any;
  pageCount: any;
  columns: any;
  rows: any;
  unite: any;
  actions: any;
  totalItems: any;
  sort = 'beginDate';
  direction = 'desc';
  iteration = 1;
  companyId: any;
  filter: any;
  filterStatus: string;
  leaveExerciseControl = new FormControl();
  width: any;
  height: any;
  isMobile: boolean;
  @Output()
  countWaintingLeavesEmiter = new EventEmitter();
  countWaintingLeaves: any;
  @Input() exercises: any[];
  leaveDate: any;
  noLeavesRequest = '';
  translatedFilterStatus: any;
  date = new FormControl({ disabled: true, value: { begin: null, end: null } });
  startDate = null;
  endDate = null;
  dateFormGroup = new FormGroup({ begin: new FormControl(), end: new FormControl() });
  index = 0;
  isClear = false;

  constructor(private router: Router,
    private leaveService: LeavesService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.getScreenSize();
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params.page ? params.page - 1 : 0;
    });
    // this.getExercises();
  }

  ngOnInit(): void {
    this.initTable();
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
    this.getAllLeaves();
    this.getLeaveOnWaiting();
    this.onChangeFiltreDate();
  }

  initTable() {
    //  this.pageIndex = 0;
    this.pageCount = 10;
    if (this.isMobile) {
      this.columns = [
        { name: 'startDateToEndDtate', prop: 'beginDateEndDate', sortable: false, minWidth: 150 },
        {
          name: 'status', prop: 'status',
          items: [
            this.translateService.instant('leave.status.WAITING'),
            this.translateService.instant('leave.status.ACCEPTED'),
            this.translateService.instant('leave.status.DENIED'),
            this.translateService.instant('leave.status.TO_CANCEL'),
          ]
        }
      ];
    } else {
      this.columns = [
        { name: 'startDateToEndDtate', prop: 'beginDateEndDate', sortable: false, minWidth: 250 },
        { name: 'exercices', prop: 'takenLeaves', sortable: false },
        {
          name: 'status', prop: 'status',
          items: [
            this.translateService.instant('leave.status.WAITING'),
            this.translateService.instant('leave.status.ACCEPTED'),
            this.translateService.instant('leave.status.DENIED'),
            this.translateService.instant('leave.status.TO_CANCEL'),
          ]
        }
      ];

    }
    this.actions = [
      { label: 'view', icon: 'pageview', showInRead: true },
      { label: 'cancel', icon: 'close', showInRead: false },
      { label: 'edit', icon: 'edit', showInRead: false },
      { label: 'delete', icon: 'delete_forever', showInRead: false }
    ];
    this.unite = this.translateService.instant('leave.leaves');
  }

  initUrlParam() {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { page: this.pageIndex + 1 },
        queryParamsHandling: 'merge'
      });
  }

  changePage(page) {
    this.pageIndex = page;
    this.initUrlParam();
    this.getAllLeaves();
  }

  newLeave() {
    this.router.navigate(['leave', 'new'], { queryParams: { page: this.pageIndex + 1 } });
  }

  getAllLeaves() {
    this.leaveService.getAllLeaves(
      this.pageIndex, this.pageCount, this.sort, this.direction, this.companyId,
      this.filter, this.filterStatus, this.startDate, this.endDate
    ).subscribe(result => {
      this.rows = result.body;
      if (this.filter && this.rows.length === 0) {
        this.noLeavesRequest = this.translateService.instant('leave.noLeaveRequest') + this.filter;
      } else if (!this.filter && this.filterStatus && this.rows.length === 0) {
        this.noLeavesRequest = this.translateService.instant('leave.noLeaveRequestForStatus') +
          this.translateService.instant('leave.status.' + this.filterStatus);
      }
      this.totalItems = 0;
      this.totalItems = result.headers.get('X-Total-Count') !== null ? + result.headers.get('X-Total-Count') : 0;
      this.rows.map(element => {
        element.duration > 1 ? element.duration = element.duration + ' jrs' : element.duration = element.duration + ' jr';
        element.beginDate = moment(element.beginDate).format('DD/MM/YYYY');
        element.endDate = moment(element.endDate).format('DD/MM/YYYY');
        element.beginDateEndDate = element.beginDate + '-' + element.endDate + ' (' + element.duration + ')';
        element.takenLeaves = element.takenLeaves.map(takenLeave => takenLeave.leaveYear).join(', ');
      });
    });
  }

  actionOnTable(action) {
    switch (action.actionType) {
      case 'view':
        this.router.navigate(['leave', action.row.id, 'view'], { queryParams: { page: this.pageIndex + 1 } });
        break;
      case 'cancel':
        this.deleteLeave(action.row.id, false);
        break;
      case 'edit':
        this.router.navigate(['leave', action.row.id, 'edit'], { queryParams: { page: this.pageIndex + 1 } });
        break;
      case 'delete':
        if (action.row.status !== 'WAITING') {
          this.snackBarService.showSnackBar(this.translateService.instant('leave.requestAllreadyTreated')
            , this.snackBarService.errorSnackBarClass);
        } else {
          this.deleteLeave(action.row.id, true);
        }
        break;
      default:
        break;
    }
  }

  onChangeFiltreDate() {
    this.dateFormGroup.controls.begin.valueChanges.subscribe(value => {
      this.startDate = value ? moment(value).format('YYYY-MM-DD') : null;
    });
    this.dateFormGroup.controls.end.valueChanges.subscribe(values => {
      if (values && this.index % 2 === 0 && !this.isClear) {
        this.index = 0;
        this.endDate = moment(values).format('YYYY-MM-DD');
        this.pageIndex = 0;
        this.router.navigate(['leave'], { queryParams: { page: this.pageIndex + 1 } });
        this.getAllLeaves();
      } else if (!values && this.index % 2 === 0 && this.isClear) {
        this.endDate = null;
        this.isClear = false;
        this.getAllLeaves();
      }
    });
  }

  rowSelected(event) {
    this.router.navigate(['leave', event.id, 'view'], { queryParams: { page: this.pageIndex + 1 } });
  }

  deleteLeave(leaveId, delet) {
    const message = delet ? this.translateService.instant('leave.deleteLeaveMsg') :
      this.translateService.instant('leave.cancelLeaveMsg');
    const options = [
      { text: this.translateService.instant('leave.yes'), value: true },
      { text: this.translateService.instant('leave.no'), value: false }
    ];
    const deletePopUp = this.dialog.open(PopupSirh, { data: { options, message } });
    deletePopUp.afterClosed().subscribe(res => {
      if (res && res === true) {
        if (delet) {
          this.leaveService.deleteLeaveRequest(this.companyId, leaveId).subscribe(resS => {
            this.snackBarService.showSnackBar(this.translateService.instant('leave.deletedLeaveRequest'),
              this.snackBarService.succesSnackBarClass);
            this.getAllLeaves();
            // this.router.navigate(['']).then(()=>this.router.navigate(['absence']));
          });
        } else {
          this.leaveService.askToCancelAcceptedLeaveRequest(this.companyId, leaveId).subscribe(result => {
            this.snackBarService.showSnackBar(this.translateService.instant('leave.canceledLeaveRequest')
              , this.snackBarService.succesSnackBarClass);
            this.getAllLeaves();
          });
        }

      }
    });
  }

  onRowSelection(event) {
    this.router.navigate(['leave', event.id, 'view'], { queryParams: { page: this.pageIndex + 1 } });
  }

  sortData(sort) {
    this.sort = sort.item;
    this.direction = sort.direction;
    this.initUrlParam();
    this.getAllLeaves();
  }
  selectionChanged(info) {
    this.filter = info.value.year;
    this.getAllLeaves();
  }

  changeFilter(filterTable: any) {
    switch (filterTable) {
      case 0:
        this.filterStatus = 'WAITING';
        break;
      case 1:
        this.filterStatus = 'ACCEPTED';
        break;
      case 2:
        this.filterStatus = 'DENIED';
        break;
      case 3:
        this.filterStatus = 'TO_CANCEL';
        break;
      default: this.filterStatus = null;
        break;
    }
    this.getAllLeaves();
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
  getLeaveOnWaiting() {
    this.leaveService.getAllLeaves(
      this.pageIndex, 0, this.sort, this.direction, this.companyId, this.filter, 'WAITING'
    ).subscribe(result => {
      const leavesOnWaiting = result.body;
      this.countWaintingLeaves = leavesOnWaiting.length;
      this.countWaintingLeavesEmiter.emit(this.countWaintingLeaves);
    });
  }
  clearDate() {
    this.isClear = true;
    this.dateFormGroup.controls.begin.setValue(null);
    this.dateFormGroup.controls.end.setValue(null);
    this.pageIndex = 0;
    this.router.navigate(['leave'], { queryParams: { page: this.pageIndex + 1 } });
  }
}