import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { RecaptchaV3Module, RECAPTCHA_LANGUAGE, RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';
import { environment } from 'environments/environment';
import { HomePageModule } from 'app/main/shared/components/home-page/homePage.module';
const key = environment.reCaptcheKey;

const rootes = [
    {
        path: '',
        component: LoginComponent
    }
];

@NgModule(
    {
        declarations: [
            LoginComponent,
        ],

        imports: [
            RouterModule.forChild(rootes),
            MatButtonModule,
            MatCheckboxModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            MatMenuModule,
            FuseSharedModule,
            TranslateModule,
            RecaptchaV3Module,
            HomePageModule,
        ],
        providers: [{
            provide: RECAPTCHA_LANGUAGE,
            useValue: 'fr',
        }, { provide: RECAPTCHA_V3_SITE_KEY, useValue: key },],
    }
)


export class LoginModule { }
