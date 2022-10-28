import { TranslateModule } from '@ngx-translate/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { RouterModule } from '@angular/router';
import { Injectable, NgModule } from '@angular/core';
import { ViewPointingComponent } from './view-pointing/view-pointing.component';
import { DataTableModule } from 'app/main/shared/components/datatable/datatable.module';
import { TrackViewrModule } from 'app/main/shared/components/trackSidebars/track-viewer.module';
import { FuseSidebarModule } from '@fuse/components';
import { PointEntryComponent } from './point-entry/point-entry.component';
import { NgQrScannerModule } from 'angular2-qrscanner';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { POSITION_OPTIONS } from '@ng-web-apis/geolocation';
import { SharedModule } from 'app/main/shared/shared.module';
import { PointingComponent } from './pointing.component';
import { PlanningsComponent } from './plannings/plannings.component';
import { MatDateFormats, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular/material-moment-adapter';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

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



const rootes = [
    {
        path: '',
        component: PointingComponent,
    },
    {
        path: 'plannings',
        component: PlanningsComponent,
        data: {
            breadcrumb: 'plannings',
            id: 'plannings'
        },
    },
    {
        path: 'my-pointings',
        component: ViewPointingComponent,
        data: {
            breadcrumb: 'view-pointing',
            id: 'my-pointings'
        },
    },
    {
        path: 'entry',
        component: PointEntryComponent,
        data: {
            breadcrumb: 'point-entry',
            id: 'entry'
        },
    },
    {
        path: 'exit',
        component: PointEntryComponent,
        data: {
            breadcrumb: 'point-exit',
            id: 'exit',

        }
    }
];

@Injectable({
    providedIn: 'root'
})
@NgModule(
    {
        declarations: [
            PointingComponent,
            ViewPointingComponent,
            PointEntryComponent,
            PlanningsComponent,
        ],

        imports: [
            RouterModule.forChild(rootes),
            FuseSharedModule,
            TranslateModule,
            DataTableModule,
            TrackViewrModule,
            FuseSidebarModule,
            NgQrScannerModule,
            ZXingScannerModule,
            SharedModule,
            CalendarModule.forRoot( { provide: DateAdapter,
                useFactory: adapterFactory})
            
        ],
        providers: [
            { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
            { provide: MAT_DATE_FORMATS, useValue: MY_FORMAT },
            { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
        
            // {
            //     provide: POSITION_OPTIONS,
            //     useValue: { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 },
            // }

        ]
    }
)


export class PointageModule { }
