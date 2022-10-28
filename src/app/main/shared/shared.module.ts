import { NgModule } from '@angular/core';
import { MaterialModule } from './material/material.module';
import { DataTableModule } from './components/datatable/datatable.module';
import { TrackViewrModule } from './components/trackSidebars/track-viewer.module';
import { FuseSidebarModule } from '@fuse/components';
import { LoaderModule } from './components/loader/loader.module';
import { HomePageModule } from './components/home-page/homePage.module';
import { TranslateModule } from '@ngx-translate/core';
import { PopupSirhModule } from './components/popUp/popup-sirh.module';
@NgModule({
  imports: [
    MaterialModule,
    DataTableModule,
    HomePageModule,
    LoaderModule,
    FuseSidebarModule,
    TrackViewrModule,
    PopupSirhModule
  ],
  declarations: [
   
  ],
  exports: [
    MaterialModule,
    TranslateModule,
    PopupSirhModule
  ],
})
export class SharedModule { }
