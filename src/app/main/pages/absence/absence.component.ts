import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
@Component({
  selector: 'app-ajouter-absence',
  templateUrl: './absence.component.html',
  styleUrls: ['./absence.component.scss']
})
export class AbsenceComponent implements OnInit {

  nbrAbsencesWaitting: any;
  selectedTab = 0;
  currentYear = new Date();
  error = true;

  constructor(private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService) { }

  ngOnInit(): void {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
  }

  changeNbrAbcences(event) {
    this.nbrAbsencesWaitting = event;
  }


}
