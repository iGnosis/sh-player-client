import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, ValidatorFn, Validators } from '@angular/forms';
import { createEvent, EventAttributes } from 'ics';
import { BehaviorSubject } from 'rxjs';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'calendar-modal',
  templateUrl: './calendar-modal.component.html',
  styleUrls: ['./calendar-modal.component.scss']
})
export class CalendarModalComponent implements OnInit {
  @Input() show: boolean = false;

  step1 = new FormBuilder().group({
    eventName: ['Sound Health Time!', Validators.required],
    gameName: ['Sit, Stand, Achieve'],
  });

  step2 = new FormBuilder().group({
    frequency: ['', Validators.required],
    weekdays: [new Set()],
    frequencyDate: [''],
    duration: [5],
    customDuration: [0],
    time: ['', Validators.required],
    notifyBefore: [30, [Validators.required, Validators.min(1)]],
    notifyBeforeUnit: ['minutes', Validators.required],
    endDate: [''],
    timezone: [Intl.DateTimeFormat().resolvedOptions().timeZone, Validators.required]
  });

  error = '';

  toggleCustomDuration = false;
  durationUnits: 'minutes' | 'hours' = 'minutes';
  timeFormatted = '';

  downloadUrl = '';
  fileValue = '';

  constructor(private gqlService: GraphqlService) {
    const d = new Date();
    this.setFormValue({ time: d.toTimeString().split(' ')[0] })
    this.timeFormatted = this.formatTime(d.toTimeString().split(' ')[0]);
  }

  ngOnInit(): void {
    this.setupConditionalRequirements();
    this.step2.get('time')?.valueChanges.subscribe(val => {
      this.timeFormatted = this.formatTime(val);
    });
  }

  setupConditionalRequirements() {
    this.step2.get('frequency')?.valueChanges.subscribe(val => {
      console.log('frequency changed');
      if (this.getFormValue('frequency') === 'weekly') {
        this.step2.controls['weekdays'].setValidators([this.validateWeekDays]);
        this.step2.controls['frequencyDate'].clearValidators();
      } else if (['monthly', 'once'].includes(this.getFormValue('frequency'))) {
        this.step2.controls['weekdays'].clearValidators();
        this.step2.controls['frequencyDate'].setValidators([Validators.required]);
      } else {
        this.step2.controls['weekdays'].clearValidators();
        this.step2.controls['frequencyDate'].clearValidators();
      }
      this.step2.controls['weekdays'].updateValueAndValidity();
      this.step2.controls['frequencyDate'].updateValueAndValidity();
    });
  }

  createICSFile = async () => {
    var date = new Date();
    var timeParts = this.getFormValue('time').split(':');
    var hours = parseInt(timeParts[0]);
    var minutes = parseInt(timeParts[1]);
    var ampm = hours >= 12 ? 'pm' : 'am';
    if (ampm === 'pm' && hours !== 12) {
        hours += 12;
    } else if (ampm === 'am' && hours === 12) {
        hours = 0;
    }
    date.setHours(hours);
    date.setMinutes(minutes);

    var startTime = new Date(date);
    let duration = this.toggleCustomDuration ? this.getFormValue('customDuration') : this.getFormValue('duration');
    duration = this.durationUnits === 'minutes' ? duration : duration * 60;
    var endTime = new Date(date.getTime() + duration * 60000);

    let reminder = this.getFormValue('notifyBefore');
    reminder = this.getFormValue('notifyBeforeUnit') === 'minutes' ? reminder : this.getFormValue('notifyBeforeUnit') === 'days' ? reminder * 24 * 60 : reminder * 60;

    let recurrenceRule = '';
    const endDate = this.getFormValue('endDate') ? new Date(this.getFormValue('endDate')).toISOString().replace(/[-:]/g, '').slice(0, -5) + 'Z' : '';
    if (this.getFormValue('frequency') === 'weekly') {
      const weekdays = Array.from(this.getFormValue('weekdays'));
      if (this.getFormValue('endDate')) {
        recurrenceRule = `FREQ=WEEKLY;UNTIL=${endDate};BYDAY=${weekdays.join(',')}`;
      }  else {
        recurrenceRule = `FREQ=WEEKLY;BYDAY=${weekdays.join(',')}`;
      }
    } else if (this.getFormValue('frequency') === 'monthly') {
      const monthDay = new Date(this.getFormValue('frequencyDate')).getDate();
      if (this.getFormValue('endDate')) {
        recurrenceRule = `FREQ=MONTHLY;UNTIL=${endDate};BYMONTHDAY=${monthDay}`;
      } else {
        recurrenceRule = `FREQ=MONTHLY;BYMONTHDAY=${monthDay}`;
      }
    } else if (this.getFormValue('frequency') === 'daily') {
      if (this.getFormValue('endDate')) {
        recurrenceRule = `FREQ=DAILY;UNTIL=${endDate}`;
      } else {
        recurrenceRule = 'FREQ=DAILY';
      }
    }

    const eventAttributes: EventAttributes = {
      start: [startTime.getFullYear(), startTime.getMonth() + 1, startTime.getDate(), startTime.getHours(), startTime.getMinutes()],
      startInputType: 'local',
      end: [endTime.getFullYear(), endTime.getMonth() + 1, endTime.getDate(), endTime.getHours(), endTime.getMinutes()],
      endInputType: 'local',
      title: this.step1.get('eventName')?.value,
      description: `Visit this link to play ${this.step1.get('gameName')?.value}: ${environment.playerClientUrl}/public/start?ref=calendar`,
      status: 'CONFIRMED',
      alarms: [
          {
              action: 'display',
              trigger: { hours: Math.floor(reminder / 60), minutes: reminder % 60, before: true },
          },
      ],
      ...( this.getFormValue('frequency') === 'once' ? {} : { recurrenceRule }),
    };

    const file: File = await new Promise((resolve, reject) => {
        createEvent(eventAttributes, async (error, value) => {
            if (error) {
                console.log('ERR::', error);
                reject(error);
            }
            this.fileValue = value;
            resolve(new File([value], 'event.ics', { type: 'text/calendar;charset=utf-8' }));
        });
    });

    const blob = new Blob([file], { type: 'text/calendar;charset=utf-8' });

    this.downloadUrl = window.URL.createObjectURL(blob);
  }

  downloadICS() {
    const a = document.createElement('a');

    a.href = this.downloadUrl;
    a.download = 'event.ics';
    a.click();
  }

  async sendInviteToEmail() {
    try {
      await this.gqlService.gqlRequest(GqlConstants.REQUEST_CALENDAR_INVITE, { fileValue: this.fileValue });
    } catch (error) {
      console.log('Error:: ', error);
    }
  }

  formatTime(time: string) {
    const [hours, minutes, seconds] = time.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const second = parseInt(seconds);
    const ampm = hour >= 12 ? 'pm' : 'am';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute < 10 ? `0${minute}` : minute} ${ampm}`;
  }

  async submitForm(step: 1 | 2) {
    this.durationValidator();
    if (step == 1) {
      this.step1.markAllAsTouched();
    
      if (this.step1.valid) {
        this.error = '';
      } else {
        this.error = "Please fill in all required fields.";
      }
    }
    if (step == 2) {
      this.step2.markAllAsTouched();
    
      if (this.step2.valid) {
        this.error = '';
        await this.createICSFile();
      } else {
        this.error = "Please fill in all required fields.";
      }
    }
  }

  durationValidator() {
    if (this.toggleCustomDuration) {
      this.step2.controls['customDuration'].setValidators([Validators.required, Validators.min(1)]);
      this.step2.controls['duration'].clearValidators();
    } else {
      this.step2.controls['duration'].setValidators([Validators.required, Validators.min(1)]);
      this.step2.controls['customDuration'].clearValidators();
    }
    this.step2.controls['customDuration'].updateValueAndValidity();
    this.step2.controls['duration'].updateValueAndValidity();
  }


  setFormValue(value: any) {
    this.step2.patchValue(value);
  }

  getFormValue(field: string) {
    return this.step2.get(field)?.value;
  }

  toggleWeekday(value: any) {
    const weekdays = this.getFormValue('weekdays');
    if (weekdays.has(value)) {
      weekdays.delete(value);
    } else {
      weekdays.add(value);
    }
    this.setFormValue({ weekdays });
  }

  validateWeekDays: ValidatorFn = (c: AbstractControl) => {
    return c.value.size > 0 ? null : {
      validateWeekDays: {
        valid: false
      }
    };
  }

  setDurationUnit(event: any) {
    this.durationUnits = event.target.value;
  }

}
