import { Component, OnInit, Input } from '@angular/core';
import { ReferentielService } from 'app/main/services/referentiel.service';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
@Component({
  selector: 'app-printable-file',
  templateUrl: './printable-file.component.html',
  styleUrls: ['./printable-file.component.scss']
})
export class PrintableFileComponent implements OnInit {
  @Input() startDate: string;
  @Input() lastDate: string;
  @Input() user: any;
  @Input() selectedMonth: any;
  @Input() pay;
  @Input() payLine: any;

  constructor(
    private refService: ReferentielService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) {
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

  currencyFormat(num, pos?) {
    if (num) {
      if (!pos) { pos = 2; }
      return (Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    } else {
      return 0;
    }
  }
}
