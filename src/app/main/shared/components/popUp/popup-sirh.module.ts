import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TranslateModule } from '@ngx-translate/core';
import { PopupSirh } from './popup-sirh.component';
import { MaterialModule } from '../../material/material.module';

@NgModule({
    declarations: [PopupSirh],
    imports: [
        NgxDatatableModule,
        FuseSharedModule,
        TranslateModule,
        MaterialModule
    ],
    providers: [],
    exports: [PopupSirh],
    entryComponents: [PopupSirh],
})
export class PopupSirhModule {}
