import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map, share, withLatestFrom } from 'rxjs/operators';
import * as _ from 'lodash';

export interface calendarDate {
  obj : moment.Moment,
  month: number
  date: number
}

@Injectable({
  providedIn: 'root'
})
export class DateService {

  private _time$ : Observable<moment.Moment>;
  private month$ : BehaviorSubject<number>;
  private view$ : BehaviorSubject<moment.unitOfTime.StartOf>;
  private year$ : BehaviorSubject<number>;

  constructor() {
    this.year$ = new BehaviorSubject(moment().get('year'));
    this.month$ = new BehaviorSubject(moment().get('month'));
    this.view$ = new BehaviorSubject("year" as moment.unitOfTime.StartOf);
    this._time$  = combineLatest([this.year$,this.month$])
      .pipe(
        map((tick) => {
          let yr = tick[0];
          let mon = tick[1];
          return moment({
            year : yr,
            month : mon
          });
        }),
        share()
      );
  }

  getCalendar() {

    return this._time$
      .pipe(
        withLatestFrom(
          this.view$,this.month$
        ),
        map(
          (time) => {
            let date = time[0];
            let view = time[1];
            let mon = time[2];
            
            const startDay = date.clone().startOf(view).startOf('week');
            const endDay = date.clone().endOf(view).endOf('week');

            console.log(startDay.format('DD/MM/YYYY'),endDay.format('DD/MM/YYYY'));
            let calendar : calendarDate[][] = [];

            let index = startDay.clone();
            while(index.isBefore(endDay,'day')) {
              calendar.push(
                new Array(7)
                  .fill(index)
                  .map(
                    (val,ind,arr) => {
                    // if(val.clone().add(1,'day').get('month') !== mon) {
                    //   return {
                    //     obj : index.add(1, 'day'),
                    //     month : index.get('month'),
                    //     date : 0
                    //   }
                    // }
                    return {
                      obj : index.add(1, 'day'),
                      month : index.get('month'),
                      date : index.get('date')
                    }
                  }
                  )
                );
            }

            return calendar;
          }
        )
      );
    
  }

  setYear(year : number) {
    this.year$.next(moment().year(year).get('year'));
  }

  setMonth(month : number) {
    this.month$.next(moment().month(month).get('month'));
  }

  getYear() {
    return this.year$;
  }

  getMonth() {
    return this.month$;
  }

}
