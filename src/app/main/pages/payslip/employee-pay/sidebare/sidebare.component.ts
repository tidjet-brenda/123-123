import { Component, OnInit, Input, Inject } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as fr } from '../../i18n/fr';
import { locale as dz } from '../../i18n/dz';
@Component({
  selector: 'app-sidebare',
  templateUrl: './sidebare.component.html',
  styleUrls: ['./sidebare.component.scss'],
  animations: fuseAnimations
})
export class SidebareComponent implements OnInit {

  @Input()
  selected: any;
  payLine: any;

  constructor(private fuseSidebarService: FuseSidebarService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public currentDialog: MatDialogRef<SidebareComponent>,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.payLine = this.data.selectedPay;
  }

  ngOnInit(): void {
  }
  action(value) {
    this.currentDialog.close(value);
  }
}
