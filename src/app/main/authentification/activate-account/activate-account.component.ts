import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl, ValidationErrors, FormBuilder } from '@angular/forms';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { fuseAnimations } from '@fuse/animations';
import { UserService } from 'app/main/services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/main/services/auth.service';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';

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
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ActivateAccountComponent implements OnInit, OnDestroy {
  datas: any;
  hidePwd = true;
  hidePwdC = true;
  lastNameControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);
  firstNameControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);
  phoneControl = new FormControl('', [Validators.required,
  Validators.minLength(3),
  ]);
  emailControl = new FormControl('', [Validators.required,
  Validators.pattern(
    '^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$'
  ),]);
  passwordControl = new FormControl('',
    [Validators.required,
    Validators.pattern('^(?=.*[0-9]{1})(?=.[a-z]*)(?=.*[A-Z]{1}).*$'),
    Validators.minLength(8),

    ]);
  passwordConfirmControl = new FormControl('', [Validators.required, confirmPasswordValidator]
  );
  activateAccountForm: FormGroup;
  private unsubscribeAll: Subject<any>;

  constructor(
    private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService,

  ) {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.unsubscribeAll = new Subject();
    this.activatedRoute.queryParams.subscribe(res => {
      if (res.key) {
        this.datas = res;
      } else {
        this.router.navigate(['/login']);
      }
     
    });
    this.initForm();
  }

  ngOnInit(): void {
    this.activateAccountForm.get('password').valueChanges
      .pipe(takeUntil(this.unsubscribeAll))
      .subscribe(() => {
        this.activateAccountForm.get('passwordConfirm').updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  initForm() {
    this.activateAccountForm = this.formBuilder.group({
      lastName: this.lastNameControl,
      firstName: this.firstNameControl,
      phone: this.phoneControl,
      email: this.emailControl,
      password: this.passwordControl,
      passwordConfirm: this.passwordConfirmControl
    });
    this.activateAccountForm.controls.firstName.setValue(this.datas.firstName);
    this.activateAccountForm.controls.lastName.setValue(this.datas.lastName);
    this.activateAccountForm.controls.phone.setValue(this.datas.phone);
    this.activateAccountForm.controls.email.setValue(this.datas.email);
    this.activateAccountForm.controls.firstName.disable();
    this.activateAccountForm.controls.lastName.disable();
    this.activateAccountForm.controls.phone.disable();
    this.activateAccountForm.controls.email.disable();
  }
  activateAccount() {
    const params = {
      key: this.datas.key,
      password: this.passwordControl.value,
    };
    this.authService.activateAccount(params).subscribe(result => {
      this.snackBarService.showSnackBar(
        this.translateService.instant('authentification.accountActivated'),
        this.snackBarService.succesSnackBarClass);
      this.router.navigate(['/login']);
    });
  }
}
