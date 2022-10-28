import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { UserService } from 'app/main/services/user.service';
import { fuseAnimations } from '@fuse/animations';
import * as moment from 'moment';
import { environment } from 'environments/environment';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
@Component({
  selector: 'app-employee-professional-infomations',
  templateUrl: './employee-professional-infomations.component.html',
  styleUrls: ['./employee-professional-infomations.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class EmployeeProfessionalInfomationsComponent implements OnInit {
  user: any;
  profilePictureUrl: any;
  companyId: any;
  martialStatus = [
    { value: 'SINGLE', text: 'Célibataire' },
    { value: 'MARRIED', text: 'Marié(e)' },
    { value: 'DIVORCED', text: 'Divorcé(e)' },
    { value: 'WIDOWED', text: 'Veuf(ve)' },
  ];
  paymentTerm = [
    { value: 'CCP', text: 'Ccp' },
    { value: 'BANK', text: 'Banque' },
    { value: 'CASH', text: 'Espèces' },
    { value: 'CHECK', text: 'Chèque' },
  ];
  workPlan = [
    { value: 'FULL_TIME', text: 'Plein temps' },
    { value: 'PART_TIME', text: 'Temps Partiel' }
  ];

  diplomaes = [];
  pictureUrl: any;
  constructor(private userService: UserService,
    private translateService: TranslateService, private fuseLoaderTranslateService: FuseTranslationLoaderService) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.getUserInfo();
    this.companyId = StorageUtils.getEmployeeCompanyId();
  }

  ngOnInit(): void {
  }

  getUserInfo() {
    this.userService.getUserInfo().subscribe(result => {
      StorageUtils.setUser(result);

      this.user = result;
      this.user.status === 'IN_POSITION' ? this.user.status = 'En poste' : this.user.status = 'Sorti';
      this.user.judgmentBirthDate === 'true' ? this.user.judgmentBirthDate = 'Oui' : this.user.judgmentBirthDate = 'Non';
      this.user.birthDate = this.user.birthDate ? moment(this.user.birthDate).format('DD/MM/YYYY') : 'non renseigné';
      this.user.spouseBirthDate = this.user.spouseBirthDate ? moment(this.user.spouseBirthDate).format('DD/MM/YYYY') : 'non renseigné';
      this.user.startDate = moment(this.user.startDate).format('DD/MM/YYYY');
      this.user.exitDate = this.user.exitDate ? moment(this.user.exitDate).format('DD/MM/YYYY') : 'non renseigné';
      this.user.nationalIdCardDeliveryDate = this.user.nationalIdCardDeliveryDate ?
        moment(this.user.nationalIdCardDeliveryDate).format('DD/MM/YYYY') : 'non renseigné';
      this.user.drivingLicenceDeliveryDate = this.user.drivingLicenceDeliveryDate ?
        moment(this.user.drivingLicenceDeliveryDate).format('DD/MM/YYYY') : 'non renseigné';
      this.user.passportDeliveryDate = this.user.passportDeliveryDate ?
        moment(this.user.drivingLicenceDeliveryDate).format('DD/MM/YYYY') : 'non renseigné';
      this.user.civility ? (this.user.civility === 'MR' ?
        this.user.civility = 'M' : this.user.civility = 'Mme') : this.user.civility = 'non renseigné';
      if (this.user.spouseStatus) {
        switch (this.user.spouseStatus) {
          case 'EMPLOYEE':
            this.user.spouseStatus = 'Employé(e)';
            break;
          case 'UNEMPLOYED':
            this.user.spouseStatus = 'Sans emploi';
            break;
          case 'RETIRED':
            this.user.spouseStatus = 'Retraité(e)';
            break;
          case '':
            this.user.spouseStatus = 'non renseigné';
            break;
          default:
            break;
        }
      }

      this.user.contractBeginDate = moment(this.user.contractBeginDate).format('DD/MM/YYYY');
      this.user.martialStatus = this.martialStatus.find(martialStatus => martialStatus.value === this.user.martialStatus) ?
        this.martialStatus.find(martialStatus => martialStatus.value === this.user.martialStatus).text : null;
      this.user.paymentTerm = this.paymentTerm.find(paymentTerm => paymentTerm.value === this.user.paymentTerm) ?
        this.paymentTerm.find(paymentTerm => paymentTerm.value === this.user.paymentTerm).text : null;
      this.user.workPlan = this.workPlan.find(workPlan => workPlan.value === this.user.workPlan) ?
        this.workPlan.find(workPlan => workPlan.value === this.user.workPlan).text : null;
      this.user.contractRegime === 'DAYS' ? this.user.contractRegime = 'Jours' : this.user.contractRegime = 'Heures';
      if (this.user.diplomaes.length === 1) {
        this.user.allDiplomaes = this.user.diplomaes[0].name;
      } else if (this.user.diplomaes.length > 1) {
        for (let index = 0; index < this.user.diplomaes.length; index++) {
          if (index === 0) {
            this.user.allDiplomaes = this.user.diplomaes[index].name;
          } else {
            this.user.allDiplomaes = (this.user.allDiplomaes ? this.user.allDiplomaes : '') + ', ' + this.user.diplomaes[index].name;
          }

        }
      } else {
        this.user.allDiplomaes = '/';
      }
      if (this.user.attachmentId) {
        this.getProfileUrl(this.user.attachmentId);
      }
    });

  }

  getProfileUrl(attachmentId) {
    return environment.ENDPOINTS.EMPLOYEE_ATTACHEMENT_URL + '/' + attachmentId;
  }

}
