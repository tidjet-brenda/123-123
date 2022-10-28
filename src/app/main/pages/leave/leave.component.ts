import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeavesService } from 'app/main/services/leaves.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-leave',
  templateUrl: './leave.component.html',
  styleUrls: ['./leave.component.scss']
})
export class LeaveComponent implements OnInit {
  countLeavesWaiting: any;
  exercises = [];
  companyId: any;
  constructor(
    private leaveService: LeavesService,
    private router: Router,
    private route: ActivatedRoute,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.companyId = StorageUtils.getEmployeeCompanyId();
  }

  ngOnInit(): void {
    this.getExercises();
  }

  leavesWaiting(event) {
    this.countLeavesWaiting = event ? event : 0;
  }

  selectedTabChange(event) {
    this.router.navigate([],
      {
        relativeTo: this.route,
        queryParams: { page: null },
        queryParamsHandling: 'merge'
      });
  }

  getExercises() {
    this.leaveService.getExercise(this.companyId).subscribe(result => {
      this.exercises = result;
      this.exercises.sort();
    });
  }
}
