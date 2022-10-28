import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from 'app/main/services/user.service';
import { ReferentielService } from 'app/main/services/referentiel.service';
import { locale as fr } from '../../i18n/fr';
import { locale as dz } from '../../i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
@Component({
  selector: 'app-civil-state',
  templateUrl: './civil-state.component.html',
  styleUrls: ['./civil-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CivilStateComponent implements OnInit {
  @Input() user: any;
  phoneControl: any;
  bloodGroupList = this.userService.bloodGroupList;

  constructor(
    private userService: UserService,
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

  getCommuneArabic(code) {
    const commune: any = this.refService.getLocalComune(code);
    return commune ? commune.arabicName : '/';
  }

  getWilayaArabic(code) {
    const wilaya: any = this.refService.getLocalWilaya(code);
    return wilaya ? wilaya.arabicName : '/';
  }

  getBloodGroup(value: string) {
    return this.bloodGroupList.find(b => b.value === value).name;
  }

  formatPhoneNumber(phoneNumber: string) {
    if (phoneNumber && !(/^[+]|[0-9]$/.test(phoneNumber.substr(phoneNumber.length - 1, 1)))) {
      phoneNumber = phoneNumber.substr(0, phoneNumber.length - 1);
      this.phoneControl.setValue(phoneNumber);
    }
    if (phoneNumber && phoneNumber.length >= 2) {
      phoneNumber = phoneNumber.replace(/ /g, '');
      let result;
      const deb = phoneNumber.substr(0, 2);
      let indicatif;
      let suite;
      if (deb === '00') {
        if (phoneNumber.length >= 3 && phoneNumber.length < 5) {
          this.phoneControl.setValue(phoneNumber.substr(0, 2) + ' ' +
            phoneNumber.substr(2, phoneNumber.length));
        } else {
          indicatif = Number(phoneNumber.charAt(5)) >= 5 ? phoneNumber.substr(0, 2) + ' ' +
            phoneNumber.substr(2, 3) + ' ' + phoneNumber.substr(5, 1) : phoneNumber.substr(0, 2) +
            ' ' + phoneNumber.substr(2, 3);
          suite = Number(phoneNumber.charAt(5)) >= 5 ? phoneNumber.substr(6, phoneNumber.length)
            : phoneNumber.substr(5, phoneNumber.length);
        }

      } else if (deb.substr(0, 1) === '0') {
        indicatif = Number(phoneNumber.charAt(1)) >= 5 ? phoneNumber.substr(0, 4)
          : phoneNumber.substr(0, 3);
        suite = Number(phoneNumber.charAt(1)) >= 5 ? phoneNumber.substr(4, phoneNumber.length)
          : phoneNumber.substr(3, phoneNumber.length);
      } else if (deb.substr(0, 1) === '+') {
        indicatif = Number(phoneNumber.charAt(4)) >= 5 ? phoneNumber.substr(0, 4)
          + ' ' + phoneNumber.substr(4, 1) : phoneNumber.substr(0, 4);
        suite = Number(phoneNumber.charAt(4)) >= 5 ? phoneNumber.substr(5, phoneNumber.length)
          : phoneNumber.substr(4, phoneNumber.length);
      } else {
        indicatif = '';
        suite = phoneNumber;
      }
      if (suite && suite.substr(2, 1) !== ' ') {
        let i = 0;
        result = suite.substr(i, 2);
        i += 2;
        while (i < suite.length) {
          result += ' ' + suite.substr(i, 2);
          i += 2;
        }
        // this.phoneControl.setValue(indicatif + ' ' + result);
        return indicatif + ' ' + result;
      }
    }
  }
}
