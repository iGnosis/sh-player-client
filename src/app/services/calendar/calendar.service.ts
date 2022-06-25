import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private _monthChangeClick = new Subject();
  monthChangeClick$ = this._monthChangeClick.asObservable();

  constructor() { }

  monthChangeClick(month: any, year: any) {
    this._monthChangeClick.next({ month, year });
  }

}
