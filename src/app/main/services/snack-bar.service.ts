import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NavigationStart, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class SnackBarService {

  errorSnackBarClass = 'error-snackbar';
  succesSnackBarClass = 'success-message-snackbar';

  constructor(
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart && event.url !== this.router.url &&
        !(
          this.router.url.split('/')[this.router.url.split('/').length-1].includes('add') ||
          this.router.url.split('/')[this.router.url.split('/').length-1].includes('new') ||
          this.router.url.split('/')[this.router.url.split('/').length-1].includes('edit') ||
          this.router.url.split('/')[this.router.url.split('/').length-1].includes('view'))) {
        snackBar.dismiss();
      }
    });
  }

  showSnackBar(message, panelClassParam, transDisabled?) {
    this.snackBar.open(
      transDisabled ? message : this.translate.instant(message),
      'X',
      {
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: [panelClassParam], // .success-message-snackbar .error-snackbar .info-message-snackbar
      }
    );
  }
}
