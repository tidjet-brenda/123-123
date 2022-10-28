import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { AbsenceService } from 'app/main/services/absence.service';
import * as moment from 'moment';
import { MatDialog } from '@angular/material/dialog';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as fr } from '../../i18n/fr';
import { locale as dz } from '../../i18n/dz';
import { PopupSirh } from 'app/main/shared/components/popUp/popup-sirh.component';
@Component({
  selector: 'app-view-all-absences',
  templateUrl: './view-all-absences.component.html',
  styleUrls: ['./view-all-absences.component.scss']
})
export class ViewAllAbsencesComponent implements OnInit {
  rows: any;
  columns: any;
  unite: any;
  hasFilter: boolean;
  actions: any;
  status: any;
  absences: any;
  width: any;
  height: any;
  isMobile: boolean;
  @Output()
  nbrAbsencesWaitingEmitter = new EventEmitter();
  nbrAbsencesWaiting: any;
  searchControl = new FormControl();
  selectedOption = 0;
  pageIndex: any;
  totalItems: any;
  pageCount: any;
  sort = 'startDate';
  direction = 'desc';
  iteration = 1;
  allAbsences: any;
  filterStatus: string;
  translatedFilterStatus: string;
  noRequests: string;
  date = new FormControl({ disabled: true, value: { begin: null, end: null } });
  startDate = null;
  endDate = null;
  @Input()
  selectedTab: any;
  companyId: any;
  filter: any;

  dateFormGroup = new FormGroup({ begin: new FormControl(), end: new FormControl() });
  index = 0;
  isClear = false;

  constructor(private router: Router,
    private absenceService: AbsenceService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.route.queryParams.subscribe(params => {
      this.pageIndex = params.page ? params.page - 1 : 0;
    });
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.companyId = StorageUtils.getEmployeeCompanyId();
    this.getScreenSize();
    this.getLeaveOnWaiting();
  }

  ngOnInit(): void {
    this.initTable();
    window.addEventListener('resize', (e) => {
      this.getScreenSize();
    });
    this.getAllAbsences();
    this.onChangeFiltreDate();
  }

  rowSelected(row) {
    this.router.navigate(['absence', row.id, 'view'],
      { queryParams: { selectedTab: this.selectedTab } });
  }

  initTable() {
    this.unite = this.translateService.instant('absence.absences');
    //  this.pageIndex = 0;
    this.pageCount = 10;
    if (this.isMobile) {
      this.columns = [
        { name: 'startDateToEndDtate', prop: 'beginDateEndDate', sortable: false, minWidth: 150 },
      ];
      this.actions = null;
    } else {
      this.columns = [
        { name: 'reason', prop: 'reason' },
        { name: 'startDateToEndDtate', prop: 'beginDateEndDate', sortable: false },
        { name: 'justified', prop: 'justified' },
        {
          name: 'status', prop: 'status',
          items: [
            this.translateService.instant('absence.status.WAITING'),
            this.translateService.instant('absence.status.ACCEPTED'),
            this.translateService.instant('absence.status.DENIED'),
            this.translateService.instant('absence.status.TO_CANCEL'),
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
  }

  actionOnTable(action) {
    switch (action.actionType) {
      case 'view':
        this.router.navigate(['absence', action.row.id, 'view'],
          { queryParams: { selectedTab: this.selectedTab, page: this.pageIndex + 1 } });
        break;
      case 'cancel':
        this.deleteAbsence(action.row.id);
        break;
      case 'edit':
        this.router.navigate(['absence', action.row.id, 'edit'],
          { queryParams: { selectedTab: this.selectedTab, page: this.pageIndex + 1 } });
        break;
      case 'delete':
        if (action.row.status !== 'WAITING') {
          this.snackBarService.showSnackBar(
            this.translateService.instant('absence.messages.deleteTreatedAbsence'),
            this.snackBarService.errorSnackBarClass);
        } else {
          this.deleteAbsence(action.row.id, true);
        }
        break;
    }
  }

  initUrlParam() {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { page: this.pageIndex + 1 },
        queryParamsHandling: 'merge'
      });
  }

  addNew() {
    this.router.navigate(['absence', 'new'], { queryParams: { page: this.pageIndex + 1 } });
  }

  getAllAbsences() {
    this.absenceService.getAllAbsences(
      this.pageIndex, this.pageCount, this.sort, this.direction, this.companyId, this.filterStatus, this.startDate, this.endDate)
      .subscribe(result => {
        this.rows = result.body;
        (this.filterStatus && this.rows.length === 0) ?
          this.noRequests = this.translateService.instant('absence.messages.noRequests') +
          this.translateService.instant('absence.status.' + this.filterStatus) : this.noRequests = '';
        this.totalItems = result.headers.get('X-Total-Count') !== null ? + result.headers.get('X-Total-Count') : 0;
        this.rows.map(element => {
          element.duration = this.setDuration(element.startDate, element.endDate, element.halfDayInBeginDate, element.halfDayInEndDate);
          element.startDate = moment(element.startDate).format('DD/MM/YYYY');
          element.endDate = moment(element.endDate).format('DD/MM/YYYY');
          element.beginDateEndDate = element.startDate + '-' + element.endDate + ' (' + element.duration + ')';
          element.justified = this.translateService.instant('absence.' + element.justified);
          element.reason = this.translateService.instant('absence.' + element.reason);
          // element.status = this.translateService.instant('absence.' + element.justified);
        });
        setTimeout(() => {
          document.getElementById('main').click();
        }, 100);
      });
  }

  deleteAbsence(absenceId, status?) {
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
          this.absenceService.deleteAbsenceRequest(this.companyId, absenceId).subscribe(resS => {
            this.afterDeleteOrCancelRequest(status);
          });
        } else {
          this.afterDeleteOrCancelRequest(status);
        }

      }
    });
  }
  afterDeleteOrCancelRequest(status) {
    this.snackBarService.showSnackBar(
      status ? this.translateService.instant('absence.absenceRequestDeleted') :
        this.translateService.instant('absence.absenceRequestToCancel')
      , this.snackBarService.succesSnackBarClass);
    this.getAllAbsences();
  }

  onRowSelection(event) {
    this.router.navigate(['absence', event.id, 'view'], { queryParams: { page: this.pageIndex + 1 } });
  }
  /**
   * on swipe page
   */
  changePage(page) {
    this.pageIndex = page;
    this.initUrlParam();
    this.getAllAbsences();
  }
  /**
   * 
   * @param sort on sort column
   */
  sortData(sort) {
    this.sort = sort.item;
    this.direction = sort.direction;
    this.initUrlParam();
    this.getAllAbsences();
  }

  setDuration(beginDate, endDate, isHalfBDay, isHalfEDay) {
    const cre = moment(beginDate);
    const end = moment(endDate);
    let duration = moment.duration(end.diff(cre)).asDays() + 1;
    if (isHalfBDay) {
      duration = duration - 0.5;
    }
    if (isHalfEDay) {
      duration = duration - 0.5;
    }
    if (duration > 0) {
      return duration + 'jours';
    } else {
      return duration + 'jour';
    }
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
    this.initUrlParam();
    this.getAllAbsences();
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
    this.absenceService.getAllAbsences(this.pageIndex, 0, this.sort, this.direction, this.companyId, 'WAITING').subscribe(result => {
      const absencesOnWaiting = result.body;
      this.nbrAbsencesWaiting = absencesOnWaiting.length;
      this.nbrAbsencesWaitingEmitter.emit(this.nbrAbsencesWaiting);
    });
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
        this.router.navigate(['absence'], { queryParams: { page: this.pageIndex + 1 } });
        this.getAllAbsences();
      } else if (!values && this.index % 2 === 0 && this.isClear) {
        this.endDate = null;
        this.isClear = false;
        this.getAllAbsences();
      }
    });
  }

  clearDate() {
    this.isClear = true;
    this.dateFormGroup.controls.begin.setValue(null);
    this.dateFormGroup.controls.end.setValue(null);
    this.pageIndex = 0;
    this.router.navigate(['absence'], { queryParams: { page: this.pageIndex + 1 } });
  }
}
