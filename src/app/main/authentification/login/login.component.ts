import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { fuseAnimations } from '@fuse/animations';
import { AuthService } from 'app/main/services/auth.service';
import { AuthGuardService } from 'app/main/services/auth-guard.service';
import { ReferentielService } from 'app/main/services/referentiel.service';
import { UserService } from 'app/main/services/user.service';
import { ReCaptchaV3Service, RecaptchaComponent } from 'ng-recaptcha';
import { Subscription } from 'rxjs';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { TranslateService } from '@ngx-translate/core';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from '../i18n/fr';
import { locale as dz } from '../i18n/dz';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class LoginComponent implements OnInit, OnDestroy {
  @ViewChild('captchaRef') recaptcha: RecaptchaComponent;
  private singleExecutionSubscription: Subscription;

  emailControl = new FormControl('', [Validators.required,
  Validators.pattern(
    '^[a-zA-Z0-9._%+-]+@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$'
  ),
  ]);
  passwordControl = new FormControl('', [Validators.required,
  Validators.minLength(8),
  ]);
  hide = true;
  fault = true;
  rememberMeValue = false;
  selectedLanguage: any;
  index = 6;
  form = new FormGroup({
    email: this.emailControl,
    password: this.passwordControl,
  });
  loading: boolean;

  constructor(
    private authService: AuthService,
    private route: Router,
    private router: ActivatedRoute,
    private authGuardService: AuthGuardService,
    private refService: ReferentielService,
    private userService: UserService,
    private recaptchaV3Service: ReCaptchaV3Service,
    private snackBarService: SnackBarService,
    private translateService: TranslateService,
    private fuseLoaderTranslateService: FuseTranslationLoaderService
  ) { }
  ngOnDestroy(): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.fuseLoaderTranslateService.loadTranslations(fr, dz);
  }

  changeRememberMe(event): void {
    this.rememberMeValue = event.checked;
  }

  executeAction(action: string, event: any): void {
    if (this.singleExecutionSubscription) {
      this.singleExecutionSubscription.unsubscribe();
    }
    this.singleExecutionSubscription = this.recaptchaV3Service.execute(action)
      .subscribe((token) => this.login(token),
      );
  }

  /**
   * login ther user to acces to the app
   */
  login(token) {
    if (this.form.valid) {
      const credentials = {
        username: this.form.get('email').value,
        password: this.form.get('password').value,
        rememberMe: this.rememberMeValue
      };

      this.authService.login(credentials, token).subscribe(res => {
        if (this.authGuardService.checkRoles(res.access_token)) {
          StorageUtils.setUser(res);
          StorageUtils.setAuthToken(res.role);
          StorageUtils.setAuthToken(res.access_token);
          this.authService.isConnected = true;
          this.route.navigate(['']);
         
        } else {
          this.snackBarService.showSnackBar(
            this.translateService.instant('authentification.unAuthorized'),
             this.snackBarService.errorSnackBarClass, true);
        }

      }, error => {
        this.index = this.index - 1;
        this.authService.setAuthenticated(false);
      });
    }
  }



  emailTrimer() {
    this.form.get('email').setValue(this.form.get('email').value.trim());
  }
}
