import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/main/services/auth.service';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ResetPasswordComponent implements OnInit, OnDestroy {

  hide = true;
  misMatch: boolean;
  noMatch: boolean;
  required: boolean;
  resetPasswordForm: FormGroup;
  errorText: string;
  newPasswordControl: FormControl = new FormControl(null, Validators.compose([
    Validators.required,
    Validators.pattern('^(?=.*[0-9]{1})(?=.[a-z]*)(?=.*[A-Z]{1}).*$'),
    Validators.minLength(8),
  ])
  );
  newPassConfirmationControl: FormControl = new FormControl(
    null,
    Validators.compose([Validators.required, Validators.minLength(8)])
  );
  private unsubscribeAll: Subject<any>;
  resetPasswordData: any;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router,
    private formBuilder: FormBuilder,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) {
    // initialisation par default
    this.unsubscribeAll = new Subject();
    this.route.queryParams.subscribe(result => {
      this.resetPasswordData = result;
    });
  }

  ngOnInit(): void {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    this.resetPasswordForm = this.formBuilder.group(
      {
        password: this.newPasswordControl,
        passwordConfirmation: this.newPassConfirmationControl,
      },
      {
        validators: [this.validateNewConfirmPassword],
      }
    );
  }

  ngOnDestroy(): void {
    // Destruction des subscribe
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  resetPassword() {
    if (this.resetPasswordForm.valid) {
      const params = {
        key: this.resetPasswordData.key,
        newPassword: this.newPasswordControl.value
      };
      this.authService.resetPassword(params).subscribe(result => {
        this.snackBarService.showSnackBar(
          this.translateService.instant('authentification.pswEdited'),
          this.snackBarService.succesSnackBarClass);
        this.router.navigate(['/login']);
      });
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

  /**
   * Password Control
   */
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

  validateNewConfirmPassword(g: FormGroup) {
    const newPass = g.get('password').value + '';
    const confPass = g.get('passwordConfirmation').value + '';
    if (newPass !== confPass) {
      return {
        misMatch: true,
      };
    } else {
      return null;
    }
  }

}
