import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { UserService } from 'app/main/services/user.service';
import { AuthService } from 'app/main/services/auth.service';
import { fuseAnimations } from '@fuse/animations';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { environment } from 'environments/environment';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { ReferentielService } from 'app/main/services/referentiel.service';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordConfirm');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
};

@Component({
  selector: 'app-employee-personal-informations',
  templateUrl: './employee-personal-informations.component.html',
  styleUrls: ['./employee-personal-informations.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmployeePersonalInformationsComponent implements OnInit, OnDestroy {

  information = true;
  resetPassword = false;
  resetPasswordForm: FormGroup;
  modifyUserInfo: boolean;
  user: any;
  hide = true;
  misMatch: boolean;
  noMatch: boolean;
  required: boolean;

  // reset-password control
  currentPasswordControl = new FormControl('', Validators.compose([
    Validators.minLength(8),
    Validators.required,
    Validators.pattern('^(?=.*[0-9]{1})(?=.[a-z]*)(?=.*[A-Z]{1}).*$')
  ]));
  newPasswordConrol = new FormControl('',
    Validators.compose([Validators.required,
    Validators.pattern('^(?=.*[0-9]{1})(?=.[a-z]*)(?=.*[A-Z]{1}).*$'),
    Validators.minLength(8),
    ]));
  newPasswordConfirmConrol = new FormControl('', Validators.compose([Validators.required, confirmPasswordValidator]));

  // modify Profile information
  lastNameControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);

  firstNameControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);

  professionControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);

  emailControl = new FormControl('', [Validators.required,
  Validators.pattern(
    '^[a-zA-Z0-9.%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$'
  ),]);

  phoneControl = new FormControl('', [Validators.required,
  Validators.minLength(10),
  ]);

  enterpriseConrol = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);

  enterpriseAdressControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);


  resetInfosForm = new FormGroup({
    lastName: this.lastNameControl,
    firstName: this.firstNameControl,
    email: this.emailControl,
    profession: this.professionControl,
    phone: this.phoneControl,
    enterprise: this.enterpriseConrol,
    enterpriseAdress: this.enterpriseAdressControl
  });

  private unsubscribeAll: Subject<any>;

  constructor(private router: Router,
    private userSeervice: UserService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBarService: SnackBarService,
    private refService: ReferentielService,
    private translateService: TranslateService, private fuseLoaderTranslateService: FuseTranslationLoaderService) {
      this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    // initialisation par default
    this.unsubscribeAll = new Subject();

  }

  ngOnInit(): void {
    this.getUserInfo();
  }

  ngOnDestroy(): void {
    // Destruction des subscribe
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  modifyPassword(): void {
    this.resetPassword = true;
    this.initResetPasswordForm();
  }

  modifyProfile() {
    this.modifyUserInfo = true;
  }

  getUserInfo() {
    this.userSeervice.getUserInfo().subscribe(result => {
      this.user = result;
      const userStatesCode = [
        this.user.state, this.user.spouseBirthState, this.user.establishmentState, this.user.passportDeliveryState, 
        this.user.nationalIdCardDeliveryState,this.user.drivingLicenceDeliveryState,this.user.birthState
      ];
      const userCommunesIds = [
        this.user.commune, this.user.spouseBirthCommune, this.user.establishmentCommune, this.user.passportDeliveryCommune, 
        this.user.nationalIdCardDeliveryCommune,this.user.drivingLicenceDeliveryCommune,this.user.birthCommune
      ];
      this.refService.getUserWilaya(userStatesCode).subscribe(states=>{
        StorageUtils.setWilayas(states);
      });
      this.refService.getUserCommunes(userCommunesIds).subscribe(userCommunes => {
        StorageUtils.setUserCommunes(userCommunes);
      });
      StorageUtils.setEmployeeCompanyId(this.user.companyId);
      setTimeout(()=>{
        this.setInfos();
      },500);
    });
    
  }

  setInfos() {
    this.lastNameControl.setValue(this.user.lastName);
    this.lastNameControl.disable();
    this.firstNameControl.setValue(this.user.firstName);
    this.firstNameControl.disable();
    this.emailControl.setValue(this.user.email);
    this.emailControl.disable();
    this.phoneControl.setValue(this.user.phoneNumber);
    this.phoneControl.disable();
    this.professionControl.setValue(this.user.savedProfessionName);
    this.professionControl.disable();
    this.enterpriseConrol.setValue(this.user.companyName);
    this.enterpriseConrol.disable();
    const commune = StorageUtils.getEmployeeCommune();
    const wilaya = StorageUtils.getEmployeeWilaya();
    const address = commune.find(value => value.code === this.user.birthCommune).name + ', '+
    wilaya.find(value => value.code === this.user.birthState).name;
    this.enterpriseAdressControl.setValue(address);
    this.enterpriseAdressControl.disable();
  }

  // change user password 

  initResetPasswordForm() {
    this.resetPasswordForm = this.formBuilder.group({
      currentPassword: this.currentPasswordControl,
      newPassword: this.newPasswordConrol,
      newPasswordConfirm: this.newPasswordConfirmConrol
    }, {
      validators: [
        this.passwordMatchValidator,
        this.validateNewConfirmPassword,
      ]
    });
  }


  passwordMatchValidator(g: FormGroup) {
    const oldPass = g.get('currentPassword').value + '';
    const newPass = g.get('newPassword').value + '';
    if (newPass === oldPass && oldPass !== '') {
      return {
        noMatch: true,
      };
    } else {
      return null;
    }
  }

  validateNewConfirmPassword(g: FormGroup) {
    const newPass = g.get('newPassword').value + '';
    const confPass = g.get('newPasswordConfirm').value + '';
    if (newPass !== confPass) {
      return {
        misMatch: true,
      };
    } else {
      return null;
    }
  }

  onNewPass() {
    const noMatch = 'noMatch';
    const required = 'required';
    if (this.resetPasswordForm.errors) {
      if (this.resetPasswordForm.errors[noMatch] !== undefined) {
        this.noMatch = true;
      } else {
        this.noMatch = false;
      }
    } else {
      this.noMatch = false;
    }
    if (this.resetPasswordForm.errors) {
      if (this.resetPasswordForm.errors[required] !== undefined) {
        this.required = true;
      } else {
        this.required = false;
      }
    } else {
      this.required = false;
    }
  }

  onConfirmPass() {
    const misMatch = 'misMatch';
    if (this.resetPasswordForm.errors) {
      if (this.resetPasswordForm.errors[misMatch] !== undefined) {
        this.misMatch = true;
      } else {
        this.misMatch = false;
      }
    } else {
      this.misMatch = false;
    }
  }

  changePassword() {
    if (this.resetPasswordForm.valid) {
      const values = {
        currentPassword: this.currentPasswordControl.value,
        newPassword: this.newPasswordConrol.value
      };
      this.authService.changePassword(values).subscribe(result => {
        this.snackBarService.showSnackBar(this.translateService.
          instant('infosPerso.majSuccess'), this.snackBarService.succesSnackBarClass);
        this.resetForm();
      });
    } else {
      this.snackBarService.showSnackBar(this.translateService.
        instant('infosPerso.required'), this.snackBarService.errorSnackBarClass);
    }
  }


  resetForm() {
  //  this.resetPasswordForm.reset();
    this.resetPassword = false;
  }


  // tslint:disable-next-line: cognitive-complexity
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
        return indicatif + ' ' + result;
      }

    }
  }

  getProfileUrl(attachmentId) {
    return environment.ENDPOINTS.EMPLOYEE_ATTACHEMENT_URL + '/' + attachmentId;
  }

  getCommune(code) {
    const commune:any = this.refService.getLocalComune(code);
    return commune ? commune.name : '/';
  }
  getWilaya(code) {
    const wilaya:any = this.refService.getLocalWilaya(code);
    return wilaya ? wilaya.name : '/';
  }

  changeToEdit(){
    this.resetPassword = !this.resetPassword;
  }

}