import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { CivilStateComponent } from './tab/civil-state/civil-state.component';
import { SpouceCordonatesComponent } from './tab/spouce-cordonates/spouce-cordonates.component';
import { EmployeePaidComponent } from './tab/employee-paid/employee-paid.component';
import { EmployeeProfessionalInfomationsComponent } from './employee-professional-infomations.component';

const rootes = [
    {
        path: '',
        component: EmployeeProfessionalInfomationsComponent
    }
];

@NgModule({
    declarations: [
        EmployeeProfessionalInfomationsComponent,
        CivilStateComponent,
        SpouceCordonatesComponent,
        EmployeePaidComponent,
    ],
    imports: [
        RouterModule.forChild(rootes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatDatepickerModule,
        MatPaginatorModule,
        MatTableModule,
        MatListModule,
        MatDividerModule,
        MatTabsModule,
        FuseSharedModule,
        TranslateModule,
    ]
})

export class EmployeeProfessionalInfomationsModule { }

