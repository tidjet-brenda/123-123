import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { startOfDay, addDays, addHours, subDays, addMinutes } from 'date-fns';
import { FuseTranslationLoaderService } from '@fuse/services/translation-loader.service';
import { locale as fr } from './../i18n/fr';
import { locale as dz } from './../i18n/dz';
import { CalendarDateFormatter, CalendarEvent, CalendarView } from 'angular-calendar';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PointingService } from 'app/main/services/pointing.service';
import { StorageUtils } from 'app/main/shared/storage-utils';
import { CustomDateFormatter } from './ custom-date-formatter.provider';

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#316EAA',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-plannings',
  templateUrl: './plannings.component.html',
  styleUrls: ['./plannings.component.scss'],
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomDateFormatter,
    },
  ],
  animations: fuseAnimations
})
export class PlanningsComponent implements OnInit {
  locale: string;
  viewDate: Date;
  view: CalendarView = CalendarView.Week;
  events: CalendarEvent[] = [];
  dayStartHour = 8;
  dayEndHour = 24;
  noPlannings = false
  days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
  constructor(
    private fuseTraslationService: FuseTranslationLoaderService,
    private translate: TranslateService,
    public dialog: MatDialog,
    private pointingService: PointingService) {
    this.fuseTraslationService.loadTranslations(fr, dz);
  }


  ngOnInit(): void {
    this.fuseTraslationService.loadTranslations(fr, dz);
    this.viewDate = new Date();

    if (this.translate.currentLang === 'dz') {
      this.locale = 'ar-DZ';
    } else {
      this.locale = 'fr-FR';
    }
    this.getPlannings()
  }

  getPlannings() {

    this.pointingService.getPlannings(+StorageUtils.getEmployeeCompanyId()).subscribe(res => {
      this.setPlannings(res);
    });
  }
  setPlannings(planning) {
    if (!planning) {
      this.noPlannings = true;
      return;
    }
    this.noPlannings = false;
    this.events = planning.dayScheduleEntries.map(p => {
      let dateSun = subDays(new Date(), new Date().getDay());
      let dayIndex = this.days.indexOf(p.day)
      let startM=(+p.start.split(':')[0] * 60 + (+p.start.split(":")[1]));
      let endM=(+p.end.split(':')[0] * 60 + (+p.end.split(':')[1]));
      return {
        id: planning.id,
        start: addMinutes(new Date(startOfDay(addDays(dateSun, dayIndex))),startM ),
        end: addMinutes(new Date(startOfDay(addDays(dateSun, dayIndex))), endM),

        title: null,
        color: colors.blue,
      };
    })
  }

}
