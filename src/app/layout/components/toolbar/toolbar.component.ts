import { UserService } from './../../../main/services/user.service';
import { Router } from '@angular/router';
import { AuthService } from './../../../main/services/auth.service';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'lodash';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';

import { navigation } from 'app/navigation/navigation';
import { environment } from 'environments/environment';
import { NotificationsService } from 'app/main/services/notifications.service';
import { StorageUtils } from 'app/main/shared/storage-utils';

@Component({
    selector: 'app-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ToolbarComponent implements OnInit, OnDestroy {
    horizontalNavbar: boolean;
    rightNavbar: boolean;
    hiddenNavbar: boolean;
    languages: any;
    navigation: any;
    selectedLanguage: any;
    userStatusOptions: any[];
    user: any;
    fullName: string;
    minimalWidthDisplay = false;
    displayBC = true;
    notificationsList = [];
    notificationsCodes = [
        { name: 'ACCEPTED_LEAVE_REQUEST', icon: 'date_range', id: 1, redirection: '/leave' },
        { name: 'ACCEPTED_ABSENCE', icon: 'perm_contact_calendar', id: 2, redirection: '/absence' },
        { name: 'DENIED_LEAVE_REQUEST', icon: 'date_range', id: 1, redirection: '/leave' },
        { name: 'DENIED_ABSENCE', icon: 'perm_contact_calendar', id: 2, redirection: '/absence' }

    ];

    nrNotifications = [];
    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {TranslateService} _translateService
     */
    constructor(
        private _fuseConfigService: FuseConfigService,
        private _fuseSidebarService: FuseSidebarService,
        private _translateService: TranslateService,

        private authService: AuthService,
        private route: Router,
        private userService: UserService,
        private notificationService: NotificationsService

    ) {
        // Set the defaults
        this.userStatusOptions = [
            {
                title: 'Online',
                icon: 'icon-checkbox-marked-circle',
                color: '#4CAF50'
            },
            {
                title: 'Away',
                icon: 'icon-clock',
                color: '#FFC107'
            },
            {
                title: 'Do not Disturb',
                icon: 'icon-minus-circle',
                color: '#F44336'
            },
            {
                title: 'Invisible',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#BDBDBD'
            },
            {
                title: 'Offline',
                icon: 'icon-checkbox-blank-circle-outline',
                color: '#616161'
            }
        ];

        this.languages = [
            {
                id: 'en',
                title: 'English',
                flag: 'us'
            },
            {
                id: 'tr',
                title: 'Turkish',
                flag: 'tr'
            }
        ];

        this.navigation = navigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
        this.getUserFullName();
        this.getAllNotifications();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        this.onResize();
        // Subscribe to the config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((settings) => {
                this.horizontalNavbar = settings.layout.navbar.position === 'top';
                this.rightNavbar = settings.layout.navbar.position === 'right';
                this.hiddenNavbar = settings.layout.navbar.hidden === true;
            });

        // Set the selected language from default languages
        this.selectedLanguage = _.find(this.languages, { id: this._translateService.currentLang });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Toggle sidebar open
     *
     * @param key
     */
    toggleSidebarOpen(key): void {
        this._fuseSidebarService.getSidebar(key).toggleOpen();
    }

    /**
     * Search
     *
     * @param value
     */
    search(value): void {
        // Do your search here...
        console.log(value);
    }

    /**
     * Set the language
     *
     * @param lang
     */
    setLanguage(lang): void {
        // Set the selected language for the toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this._translateService.use(lang.id);
    }

    //logout

    logout() {
        this.authService.logout().subscribe(res => {
            StorageUtils.removeAuthToken();
            StorageUtils.removeUser();
            localStorage.clear();
            this.authService.setAuthenticated(false);
            this.route.navigate(['/login']);
        });
    }

    profile() {
        this.route.navigate(['/employee-personal-informations']);
    }

    getUserFullName() {
        this.userService.getUserInfo().subscribe(user => {
            this.user = user;
            this.fullName = this.user.lastName.toUpperCase() + ' ' + this.user.firstName.charAt(0).toUpperCase() +
                this.user.firstName.slice(1).toLowerCase();
        });
    }
    getProfileUrl(attachmentId) {
        return environment.ENDPOINTS.EMPLOYEE_ATTACHEMENT_URL + '/' + attachmentId;
    }
    markAsRead(id?) {
        this.notificationService.markNotificationAsRead(id).subscribe(result => {
            this.getAllNotifications();
        });
    }

    onResize() {
        if (window.innerWidth > 500) {
            if (this.minimalWidthDisplay !== false) { this.minimalWidthDisplay = false; }
        } else {
            if (this.minimalWidthDisplay !== true) { this.minimalWidthDisplay = true; }
        }
        if (window.innerWidth > 850) {
            if (this.displayBC !== true) { this.displayBC = true; }

        } else {
            if (this.displayBC !== false) { this.displayBC = false; }
        }
    }

    getAllNotifications() {
        this.notificationsList = [];
        this.nrNotifications = [];
        this.notificationService.getAllNotifications().subscribe(
            res => {
                res.map(n => {
                    this.notificationsCodes.forEach(nc => {
                        if (nc.name === n.typeName) {
                            n.icon = nc.icon;
                            n.redirection = nc.redirection;
                            n.title = this.translateNotificationTitle(n.typeName);
                        }
                    });
                    if (!n.received) {
                        this.nrNotifications.push(n.id);
                    }
                });
                this.notificationsList = res;
            });
    }

    translateNotificationTitle(title) {
        switch (title) {
            case 'ACCEPTED_LEAVE_REQUEST':
                return 'Une demande de congé a été acceptée';
            case 'DENIED_LEAVE_REQUEST':
                return 'Une demande de congé a été refusée';
            case 'ACCEPTED_ABSENCE':
                return 'Une demande d\'absence a été acceptée';
            case 'DENIED_ABSENCE':
                return 'Une demande d\'absence a été refusée';
            default: return null;
        }
    }

    leaveRedirection(notif) {
        this.route.navigate([notif.redirection, notif.entityId, 'view']);
        //this.markAsRead(notif.id);
    }

}
