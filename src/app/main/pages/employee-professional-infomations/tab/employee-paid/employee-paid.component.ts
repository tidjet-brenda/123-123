import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { locale as fr } from '../../i18n/fr';
import { locale as dz } from '../../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { ReferentielService } from 'app/main/services/referentiel.service';
@Component({
  selector: 'app-employee-paid',
  templateUrl: './employee-paid.component.html',
  styleUrls: ['./employee-paid.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeePaidComponent implements OnInit {
  @Input() user: any;
  constructor(
    private refService: ReferentielService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
  }

  ngOnInit(): void { }

  getCommune(code) {
    const commune: any = this.refService.getLocalComune(code);
    return commune ? commune.name : '/';
  }

  getWilaya(code) {
    const wilaya: any = this.refService.getLocalWilaya(code);
    return wilaya ? wilaya.name : '/';
  }
}
