import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { calendarDate, DateService } from './service/date.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'ang-calendar',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{

  days : any[] = moment.weekdaysShort();
  months : string[] = moment.monthsShort();
  years : number[] = _.range(moment().get('year'),(moment().get('year') - 100));

  calendar : any;

  currentMonth : Observable<string>;
  currentYear : Observable<number>;

  currentSection = moment.monthsShort()[moment().get('month')];

  constructor(
    private dateService : DateService
  ) {
    this.days.push(this.days.shift());

    this.currentMonth = this.dateService.getMonth().pipe(map(mth => this.months[mth]));
    this.currentYear = this.dateService.getYear();
    this.calendar = this.dateService.getCalendar();
  }

  changeMonth(month : any) {
    // this.dateService.setMonth(month);
  }

  changeYear(year : any) {
    this.dateService.setYear(year);
  }

  getMonth(week : calendarDate[],i : number) {
    if(week.some(day => day.date == 1)) {
      return this.months[week.filter(day => day.date == 1)[0].month];
    }
    else {
      return '';
    }
  }

  onSectionChange(sectionId: string) {
    console.log(sectionId);
    this.currentSection = sectionId;
  }

  scrollTo(section : string) {
    console.log(section);
    this.currentSection = section;
    console.log(document.querySelector('#' + section));
    (document.querySelector('#' + section) as Element)
      .scrollIntoView(true);
  }
}
