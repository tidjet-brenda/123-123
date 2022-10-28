import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthGuardService } from '../services/auth-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { PagesComponent } from './pages.component';



const appRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '',
                redirectTo: 'employee-personal-informations',
                pathMatch: 'full'
            },
            {
                path: 'employee-professional-infomations',
                loadChildren: () => import('./employee-professional-infomations/employee-professional-infomations.module')
                    .then(m => m.EmployeeProfessionalInfomationsModule),
                canActivate: [AuthGuardService]
            },

            {
                path: 'employee-personal-informations',
                loadChildren: () => import('./employee-personal-informations/employee-personal-informations.module').then(
                    m => m.EmployeePersonalInformationsModule
                ),
                canActivate: [AuthGuardService]
            },

            {
                path: 'leave',
                loadChildren: () => import('./leave/leave.module').then(m => m.LeaveModule),
                canActivate: [AuthGuardService]
            },

            {
                path: 'absence',
                loadChildren: () => import('./absence/absence.module').then(m => m.AbsenceModule),
                canActivate: [AuthGuardService]
            },

            {
                path: 'payslip',
                loadChildren: () => import('./payslip/payslip.module').then(m => m.PayslipModule),
                canActivate: [AuthGuardService]
            },

            {
                path: 'pointing',
                loadChildren: () => import('./pointing/pointing.module').then(m => m.PointageModule),
                canActivate: [AuthGuardService]
            },
        ]
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forChild(appRoutes),
    ]
})
export class PagesModule { }
