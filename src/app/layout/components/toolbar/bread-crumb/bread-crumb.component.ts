import { Component, OnInit, Input } from '@angular/core';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { Router } from '@angular/router';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from '../../../../navigation/i18n/fr';
import { locale as dz } from '../../../../navigation/i18n/dz';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-bread-crumb',
  templateUrl: './bread-crumb.component.html',
  styleUrls: ['./bread-crumb.component.scss']
})
export class BreadCrumbComponent implements OnInit {
  action: string;
  @Input()
  user: any;
  module: string;
  moduleLink: string;
  constructor(private fuseNavigationService: FuseNavigationService,
    private router: Router, private fuseTranslationLoaderService: FuseTranslationLoaderService,
    private translate: TranslateService) { }

  ngOnInit(): void {
    this.fuseTranslationLoaderService.loadTranslations(fr,dz);
    this.getBreadCrumb();
    this.router.events.subscribe(event => {
      this.getBreadCrumb();
    });
  }
  getBreadCrumb() {
    this.action = null;
    this.module = null;
    this.moduleLink = null;
    const currentUrl = this.router.url;
    const navigationItems = currentUrl.split('/');
    this.module = this.fuseNavigationService.getNavigationItem(navigationItems[1]).translate;
    this.moduleLink = this.fuseNavigationService.getNavigationItem(navigationItems[1]).url;
    if (navigationItems.length > 2) {
      this.getAction(navigationItems);
    }
  }
  getAction(navigationItems) {
    if (navigationItems[1] === 'pointing') {
      this.module = this.fuseNavigationService.getNavigationItem(navigationItems[2]).translate;
      this.moduleLink = this.fuseNavigationService.getNavigationItem(navigationItems[2]).url;
    }
    navigationItems.forEach(item => {
      if (item.includes('view')) {
        this.action = 'Visualiser la demande';
      } else if (item.includes('edit')) {
        this.action = 'Modifier la demande';
      } else if (item.includes('new')) {
        this.action = 'Ajouter une demande';
      } else {
        this.action = undefined;
      }
    });
  }
}
