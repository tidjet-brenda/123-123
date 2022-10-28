import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/main/services/auth.service';
import { Router } from '@angular/router';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ForgotPasswordComponent implements OnInit {
  emailControl = new FormControl('', [
    Validators.required,
    Validators.pattern(
      '^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$'
    ),]);

  form = new FormGroup({
    email: this.emailControl,
  });

  constructor(
    private authService: AuthService,
    private snackBarService: SnackBarService,
    private router: Router,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) { }

  ngOnInit(): void {

    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
    console.log("history",history)
    this.form.controls.email.setValue(history.state.email)
  }

  getResetPasswordLink() {
    const email = this.emailControl.value;
    this.authService.getResetPasswordLink(email).subscribe(result => {
      this.snackBarService
        .showSnackBar(
          this.translateService.instant('authentification.emailEmitted'),
          this.snackBarService.succesSnackBarClass, true);
    });
  }

}
