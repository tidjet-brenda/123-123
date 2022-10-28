import { LeaveComponent } from './leave.component';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { DataTableModule } from 'app/main/shared/components/datatable/datatable.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveFormsModule } from '@angular/forms';
import { ViewAllLeaveComponent } from './view-all-leave/view-all-leave.component';
import { SingleLeaveViewComponent } from './single-leave-view/single-leave-view.component';
import { CumulativeLeavesComponent } from './cumulative-leaves/cumulative-leaves.component';
import { MatDateFormats, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { AddLeaveComponent } from './add leave/add-leave.component';
import { SharedModule } from 'app/main/shared/shared.module';
export const MY_FORMAT: MatDateFormats = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};


const routes = [
    {
        path: '',
        component: LeaveComponent,
    },

    {
        path: 'new',
        component: AddLeaveComponent,
        data: {
            breadcrumb: 'create',
            id: 'create-leave'
        }
    },

    {
        path: ':id/edit',
        component: AddLeaveComponent,
        data: {
            breadcrumb: 'edit',
            id: 'edit-leave'
        }
    },
    {
        path: ':id/view',
        component: SingleLeaveViewComponent,
        data: {
            breadcrumb: 'view',
            id: 'view-single-leave'
        }
    },

];

@NgModule({
    declarations: [
        LeaveComponent,
        AddLeaveComponent,
        ViewAllLeaveComponent,
        SingleLeaveViewComponent,
        CumulativeLeavesComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        TranslateModule,
        FuseSharedModule,
        DataTableModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatTabsModule,
        DataTableModule,
        ReactiveFormsModule,
        SharedModule
    ],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
    ],
})

export class LeaveModule { }