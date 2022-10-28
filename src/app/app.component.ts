import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { DOCUMENT, NgIf } from '@angular/common';
import { Platform } from '@angular/cdk/platform';
import { TranslateService } from '@ngx-translate/core';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { FuseSplashScreenService } from '@fuse/services/splash-screen.service';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { navigation } from 'app/navigation/navigation';
import { locale as fr } from 'app/navigation/i18n/fr';
import { locale as dz } from 'app/navigation/i18n/dz';
import { AuthService } from './main/services/auth.service';
import { SwUpdate } from '@angular/service-worker';
import { LoaderComponent } from './main/shared/components/loader/loader.component';
import { SnackBarService } from 'app/main/services/snack-bar.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FuseConfig } from '@fuse/types';
import { GeolocationService } from './main/services/geolocation.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-employee',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;
    loaderExceptions = ['recaptcha', 'login', 'logout', 'qr-codes'];
    sub: Subscription;
    // Private
    private unsubscribeAll: Subject<any>;
    public LoaderComponent = LoaderComponent;

    constructor(
        @Inject(DOCUMENT) private document: any,
        private fuseConfigService: FuseConfigService,
        private fuseNavigationService: FuseNavigationService,
        private fuseSidebarService: FuseSidebarService,
        private fuseSplashScreenService: FuseSplashScreenService,
        private fuseTranslationLoaderService: FuseTranslationLoaderService,
        private translateService: TranslateService,
        private platform: Platform,
        private snackBar: MatSnackBar,
        private platformeService: Platform,
        private authService: AuthService,
        private swUpdate: SwUpdate,
        private geolocationService: GeolocationService,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer,
    ) {
        this.authService.getCSRFToken().subscribe();
        // Get default navigation
        this.navigation = navigation;

        // Register the navigation to the service
        this.fuseNavigationService.register('main', this.navigation);

        // Set the main navigation as our current navigation
        this.fuseNavigationService.setCurrentNavigation('main');

        // Add languages
        this.translateService.addLangs(['fr', 'dz']);

        // Set the default language
        this.translateService.setDefaultLang('fr');

        // Set the navigation translations
        this.fuseTranslationLoaderService.loadTranslations(fr, dz);

        // Use a language
        this.translateService.use('fr');

        // Add is-mobile class to the body if the platform is mobile
        if ((this.platform.ANDROID || this.platform.IOS)) {
            this.document.body.classList.add('is-mobile');
            this.geolocationService.initWatchPosition();
        }

        // Set the private defaults
        this.unsubscribeAll = new Subject();

    }

    /** 
     * On init
     */
    ngOnInit(): void {
        this.fetchSvgIcons();
        if ((this.platform.ANDROID || this.platform.IOS)) {
            const conf: FuseConfig = this.fuseConfigService.defaultConfig;
            conf.layout.navbar.hidden = true;
            conf.layout.footer.background = '#fff';
        }
        // Subscribe to config changes
        this.fuseConfigService.config
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe((config) => {

                this.fuseConfig = config;

                // Boxed
                if (this.fuseConfig.layout.width === 'boxed') {
                    this.document.body.classList.add('boxed');
                }
                else {
                    this.document.body.classList.remove('boxed');
                }

                // Color theme - Use normal for loop for IE11 compatibility
                for (const className of this.document.body.classList) {
                    if (className.startsWith('theme-')) {
                        this.document.body.classList.remove(className);
                    }
                }

                this.document.body.classList.add(this.fuseConfig.colorTheme);
            });

        if (this.swUpdate.isEnabled) {

            this.swUpdate.available.subscribe(() => {

                if (confirm('Nouvelle version disponible, souhaitez-vous mettre à jour votre application ?.')) {

                    window.location.reload();
                }
            });
        }
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }
    fetchSvgIcons() {
        this.iconRegistry.addSvgIcon('time',
            this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/material-icons/time.svg'));
        this.iconRegistry.addSvgIcon('leave',
            this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/material-icons/leave.svg'));
        this.iconRegistry.addSvgIcon('absence',
            this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/material-icons/absence.svg'));
        this.iconRegistry.addSvgIcon('payroll',
            this.sanitizer.bypassSecurityTrustResourceUrl('../assets/icons/material-icons/payroll.svg'));

    }
    /**
     * Toggle sidebar open
     */
    toggleSidebarOpen(key): void {
        this.fuseSidebarService.getSidebar(key).toggleOpen();
    }
}
