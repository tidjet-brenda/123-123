import { ActivateAccountComponent } from './activate-account.component';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HomePageModule } from 'app/main/shared/components/home-page/homePage.module';

const rootes = [
    {
        path: '',
        component: ActivateAccountComponent
    }
];

@NgModule(
    {
        declarations: [
            ActivateAccountComponent
        ],

        imports: [
            RouterModule.forChild(rootes),
            MatButtonModule,
            MatCheckboxModule,
            MatFormFieldModule,
            MatIconModule,
            MatInputModule,
            HomePageModule,
            FuseSharedModule,
            TranslateModule,
        ]
    }
)


export class ActivateAccountModule { }