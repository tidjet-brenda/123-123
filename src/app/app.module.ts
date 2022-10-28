
import { AuthGuardService } from './main/services/auth-guard.service';
import { AuthService } from './main/services/auth.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { MatMomentDateModule, MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { fuseConfig } from 'app/fuse-config';
import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { MAT_DATE_LOCALE, MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { PagesComponent } from './main/pages/pages.component';
import { HttpErrorInterceptor } from './navigation/http.interceptor';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { LoaderModule } from './main/shared/components/loader/loader.module';
import { SharedModule } from './main/shared/shared.module';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import localeFr from '@angular/common/locales/fr';
import localeAr from '@angular/common/locales/ar-DZ';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr, 'fr-FR');
registerLocaleData(localeAr, 'ar-DZ');
export const MY_FORMAT: MatDateFormats = {
    parse: {
        // tslint:disable-next-line: no-duplicate-string
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


const appRoutes: Routes = [
    {
        path: '',
        loadChildren: () => import('./main/pages/pages.module').then(m => m.PagesModule),
        canActivate: [AuthGuardService]
    },

    {
        path: 'login',
        loadChildren: () => import('./main/authentification/login/login.module').then(m => m.LoginModule),
        canActivate: [AuthGuardService],
        data: {
            page: 'notConnect'
        }
    },

    {
        path: 'activate-account',
        loadChildren: () => import('./main/authentification/activate-account/activate-account.module').then(m => m.ActivateAccountModule),
        canActivate: [AuthGuardService],
        data: {
            page: 'notConnect'
        }
    },

    {
        path: 'forgot-password',
        loadChildren: () => import('./main/authentification/forgot-password/forgot-password.module').then(m => m.ForgotPAsswordModule),
        canActivate: [AuthGuardService],
        data: {
            page: 'notConnect'
        }
    },

    {
        path: 'reset-password',
        loadChildren: () => import('./main/authentification/reset-password/reset-password.module').then(m => m.ResetPasswordModule),
        canActivate: [AuthGuardService],
        data: {
            page: 'notConnect'
        }
    },

];

@NgModule({
    declarations: [
        AppComponent,
        PagesComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' }),
        TranslateModule.forRoot(),
        // Material moment date module
        MatMomentDateModule,
        // Material
        SharedModule,
        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,
        // App modules
        LayoutModule,
        ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
        LoaderModule,
        NgHttpLoaderModule.forRoot(),
        CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory })
    ],

    providers: [
        AuthService,
        AuthGuardService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpErrorInterceptor,
            multi: true
        },
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    ],

    bootstrap: [
        AppComponent
    ]
})
export class AppModule {
}
