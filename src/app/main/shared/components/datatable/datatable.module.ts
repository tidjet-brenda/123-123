import { NgModule } from '@angular/core';
import { FuseSharedModule } from '@fuse/shared.module';
import { DocsComponentsThirdPartyNgxDatatableComponent } from './ngx-datatable.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { MaterialModule } from '../../material/material.module';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
    declarations: [DocsComponentsThirdPartyNgxDatatableComponent],
    imports: [
        FuseSharedModule,
        NgxDatatableModule,
        MaterialModule,
        TranslateModule
    ],
    providers: [],
    exports: [DocsComponentsThirdPartyNgxDatatableComponent],
    entryComponents: [],
})
export class DataTableModule {}
