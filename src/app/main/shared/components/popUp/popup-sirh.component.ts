import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
@Component({
  selector: 'app-popup-sirh',
  templateUrl: './popup-sirh.component.html',
  styleUrls: ['./popup-sirh.component.scss']
})
// tslint:disable-next-line: component-class-suffix
export class PopupSirh implements OnInit {
  options: any[];
  msg: string;
  isWarning = false;
  hasMonthDate = false;
  month: any;
  constructor(
    private fuseTranslationLoaderService: FuseTranslationLoaderService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public currentDialog: MatDialogRef<PopupSirh>,
    private translateService: TranslateService,
    private fuseTranslationLoader: FuseTranslationLoaderService
  ) {
    this.options = this.data.options;
    this.msg = this.data.message;
    this.isWarning = this.data.isWarning;
    this.hasMonthDate = this.data.hasMonthDate;
    this.month = this.data.month;
  }

  ngOnInit() {
    this.fuseTranslationLoader.loadTranslations(fr, dz);
  }

  action(value) {
    this.currentDialog.close(value);
  }

}
