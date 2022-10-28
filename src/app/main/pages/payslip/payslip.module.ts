import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { EmployeePayComponent } from './employee-pay/employee-pay.component';
import { PrintableFileComponent } from './printable-file/printable-file.component';
import { SidebareComponent } from './employee-pay/sidebare/sidebare.component';
import { FuseSidebarModule } from '@fuse/components';
import { SharedModule } from 'app/main/shared/shared.module';
import { PayslipComponent } from './payslip.component';



const rootes = [
    {
        path : '',
        component : PayslipComponent,
    },
    {
        path : 'printable-file',
        component : PrintableFileComponent,
    }
];


@NgModule(
    {
        declarations: [ 
            PayslipComponent,
            EmployeePayComponent,
            PrintableFileComponent,
            SidebareComponent,
        ],

        imports: [
            RouterModule.forChild(rootes),
            FuseSharedModule,
            TranslateModule,
            FuseSidebarModule,
            SharedModule
        ]
    }
)


export class PayslipModule{}
