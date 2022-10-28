import { Component, OnInit, Input } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { TranslateService } from '@ngx-translate/core';
import { locale as fr } from './i18n/fr';
import { locale as dz } from './i18n/dz';

@Component({
    selector: 'app-view-sidebar',
    templateUrl: './view.component.html',
    styleUrls: ['./view.component.scss'],
    animations: fuseAnimations
})
export class ViewSidebarComponent implements OnInit {
    @Input()
    selected: any;
    @Input()
    isMobile : boolean;

    constructor( private fuseSidebarService : FuseSidebarService,
        private translateService: TranslateService,
        private fuseTranslationLoader: FuseTranslationLoaderService
    ) {
        this.fuseTranslationLoader.loadTranslations(fr, dz);
    }

    ngOnInit(): void {  
    }

    close() {
        this.fuseSidebarService.getSidebar('file-manager-details-sidebar').close();
      }
}
