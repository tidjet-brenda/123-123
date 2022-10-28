import { NgModule } from '@angular/core';
import { ViewSidebarComponent } from './view.component';
import { FuseSharedModule } from '@fuse/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../../material/material.module';

@NgModule({
    declarations: [ViewSidebarComponent],
    imports: [
        FuseSharedModule,
        TranslateModule,
        MaterialModule

    ],
    providers: [],
    exports: [ViewSidebarComponent],
    entryComponents: [],
})
export class TrackViewrModule {}

