import { Component } from '@angular/core';
import { Platform } from '@angular/cdk/platform';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    currentYear = new Date().getFullYear();
    inMobile: boolean;
    links = [];
    topLinks = [];
    pointing: boolean;
    open: boolean;
    absenceLink = '/absence';
    showTopItems: boolean;
    /**
     * Constructor
     */
    constructor(private platform: Platform) {
        if ((this.platform.ANDROID || this.platform.IOS)) {
            this.inMobile = true;
        }

        this.links = [
            { title: 'Infos', icon: 'people_alt', path: '/employee-professional-infomations' },
            { title: 'Congés', icon: 'calendar_today', path: '/leave' },
            { title: 'pointage', icon: 'date_range', path: '/pointing/my-pointings' },
            { title: 'Absences', icon: 'perm_contact_calendar', path: '/absence' },
            { title: 'Paie', icon: 'account_balance_wallet', path: '/payslip' } 
          

        ];

        this.topLinks = [
            { title: 'Pointages', icon: 'date_range', path: '/pointing/my-pointings' },
            { title: 'Entree', icon: 'vertical_align_top', path: '/pointing/entry' },
            { title: 'Sortie', icon: 'vertical_align_bottom', path: '/pointing/exit' },
            { title: 'Planning', icon: 'today', path: '/pointing/plannings' }        
        ];
        document.getElementById('container-3').addEventListener('click', (event) => {
            if (this.open) {
                this.closeDisc();
            }
        });
        document.getElementById('container-3').addEventListener('touchstart', (event) => {
            if (this.open) {
                this.closeDisc();
            }
        });
    }


    openDisc() {
        this.showTopItems = false;
        this.open = !this.open;
        setTimeout(() => {
            this.showTopItems = true; 
        }, 250);
    }

    closeDisc() {
        this.open = false;
        this.showTopItems = false;
    }
}
