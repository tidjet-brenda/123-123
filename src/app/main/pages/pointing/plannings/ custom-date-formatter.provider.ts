import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
import { formatDate } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable()
export class CustomDateFormatter extends CalendarDateFormatter {
  // you can override any of the methods defined in the parent class
  public weekViewColumnHeader({ date, locale }: DateFormatterParams): string {
      
      if (window.innerWidth <= 576) {
        return formatDate(date, 'EEEEEE', 'fr-FR');
      } else {
        return formatDate(date, 'EEEE', 'fr-FR');
      }
  }


}