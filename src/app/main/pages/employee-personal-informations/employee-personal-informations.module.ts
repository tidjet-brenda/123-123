import { MatDividerModule } from '@angular/material/divider';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { EmployeePersonalInformationsComponent } from './employee-personal-informations.component';




const rootes = [
    {
        path: '',
        component: EmployeePersonalInformationsComponent,
    }
];

@NgModule(
    {  
        declarations: [
            EmployeePersonalInformationsComponent,
        ],

        imports: [
            RouterModule.forChild(rootes),
            MatButtonModule,
            MatCheckboxModule,
            ReactiveFormsModule,
            MatFormFieldModule,
            MatIconModule,  
            MatInputModule,
            MatTableModule,
            MatTabsModule,
            MatDividerModule,
            FuseSharedModule,
            TranslateModule,
        ]
    }
)


export class EmployeePersonalInformationsModule{}
