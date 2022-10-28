import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { AbsenceComponent } from './absence.component';
import { AddAbsenceComponent } from './add-absence/add-absence.component';
import { SingleViewAbsenceComponent } from './single-view-absence/single-view-absence.component';
import { ViewAllAbsencesComponent } from './tabs/view-all-absences/view-all-absences.component';
import { DataTableModule } from 'app/main/shared/components/datatable/datatable.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { MY_FORMAT } from '../leave/leave.module';
import { PopupSirh } from 'app/main/shared/components/popUp/popup-sirh.component';
import { MaterialModule } from 'app/main/shared/material/material.module';

const routes = [
    {
        path: '',
        component: AbsenceComponent
    }, {
        path: 'new',
        component: AddAbsenceComponent,
        data: {
            breadcrumb: 'create',
            id: 'create-absence'
        }
    }, {
        path: ':id/edit',
        component: AddAbsenceComponent,
        data: {
            breadcrumb: 'edit',
            id: 'edit-absence'
        }
    }, {
        path: ':id/view',
        component: SingleViewAbsenceComponent,
        data: {
            breadcrumb: 'view',
            id: 'view-absence'
        }
    },
];

@NgModule({
    declarations: [
        AbsenceComponent,
        AddAbsenceComponent,
        SingleViewAbsenceComponent,
        ViewAllAbsencesComponent,
        ViewAllAbsencesComponent,
    ],
    imports: [
        RouterModule.forChild(routes),
        MaterialModule,
        DataTableModule,
        ReactiveFormsModule,
        FuseSharedModule,
        TranslateModule,
    ],
    entryComponents: [PopupSirh],
    providers: [
        { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
        { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
        { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } }
    ],
})
export class AbsenceModule { }

