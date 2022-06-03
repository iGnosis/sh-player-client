import { 
  Component, 
  OnInit, 
  Renderer2, 
  ChangeDetectionStrategy,
  ChangeDetectorRef, 
} from '@angular/core';
import * as d3 from 'd3';
import { GoalsService } from 'src/app/services/goals/goals.service';
import {
} from '@angular/core';
import { MatCalendar } from '@angular/material/datepicker';
import { DateAdapter } from '@angular/material/core';
import { CalendarService } from 'src/app/services/calendar/calendar.service';

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
})
export class GoalsComponent implements OnInit {
  monthRange = d3.range(0, 30.5, 5);
  dailyRange = d3.range(0, 30.5, 5).map(item => item+'');
  monthlyGoals!: any; 
  dailyGoals!: any; 
  streak!: any; 
  monthlyCompletion!: number;
  monthlyCompletionPercent!: number;
  dailyCompletionPercent!: number;
  monthlyGoal: number = 30;
  dailyGoal: number = 30;
  monthlyGoalPercent!: number;
  dailyGoalPercent!: number;
  exampleHeader = ExampleHeader;
  monthSelected!: any;

  constructor(
    private goalsService: GoalsService,
    private renderer: Renderer2,
    calendarService: CalendarService
  ) {
    calendarService.monthChangeClick$.subscribe((e: any) => this.updateCalendarActivity(e.month, e.year))
  }

  async ngOnInit(): Promise<void> {
    this.monthlyGoals = await this.goalsService.getMonthlyGoals(5, 2022);
    this.dailyGoals = await this.goalsService.getDailyGoals(new Date().toISOString().split('T')[0]);
    this.dailyCompletionPercent = (this.dailyGoals * 100)/this.roundMaxGoal(this.dailyGoals);
    this.monthlyCompletion = (this.monthlyGoals.filter((day: any) => day.totalSessionDurationInMin >= 30).length);
    const noOfDays = new Date(new Date().getFullYear(), new Date().getMonth()+1, 0).getDate();
    this.monthlyCompletionPercent = (this.monthlyCompletion * 100) / noOfDays;
    this.monthRange = d3.range(0, noOfDays + 0.001, Math.floor(noOfDays/6))
    this.monthlyGoal = (this.monthlyGoal > this.monthlyCompletion) ? this.monthlyGoal : this.monthRange.slice(-1)[0];
    this.monthlyGoalPercent = (this.monthlyGoal * 100) / this.roundMaxGoal(this.monthlyCompletion);
    this.dailyRange = 
      d3
        .range(0, this.roundMaxGoal(this.dailyGoals) + 0.001, Math.ceil(this.roundMaxGoal(this.dailyGoals)/6))
        .map(item => (item % 60 === 0 && item !== 0) ? (item/60) + 'hr' : (item%60) + '');
    this.dailyGoalPercent = (this.dailyGoal * 100) / this.roundMaxGoal(this.dailyGoals);
    this.streak = await this.goalsService.getStreak();
    this.updateCalendarActivity(new Date().getMonth(), new Date().getFullYear());

    this.initMonthlyBar();
    this.initDailyBar();
    this.toggleIndicatorOnOverlap();
  }
  initMonthlyBar() {
    let svg = d3.select('.progress')
      .append('svg');
    svg.append('rect')
		.attr('class', 'bg-rect')
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('fill', '#000000')
		.attr('height', '100%')
		.attr('width', '100%')
    let progress = svg.append('rect')
      .attr('class', 'progress-rect')
      .attr('fill', '#B6E5C8')
      .attr('height', '100%')
      .attr('width', 0)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('y', 0);
    progress.transition()
      .duration(500)
      .attr('width', this.monthlyCompletionPercent + '%');      
  }
  initDailyBar() {
    let svg = d3.select('.daily-progress')
      .append('svg')
      .attr('height', '100%')
      .attr('width', '100%');
    svg.append('rect')
		.attr('class', 'bg-daily-rect')
		.attr('rx', 10)
		.attr('ry', 10)
		.attr('fill', '#FFFFFF')
		.attr('height', '100%')
		.attr('width', '100%')
    let progress = svg.append('rect')
      .attr('class', 'progress-rect')
      .attr('fill', '#007F6E')
      .attr('height', '100%')
      .attr('width', 0)
      .attr('rx', 10)
      .attr('ry', 10)
      .attr('y', 0);
    progress.transition()
      .duration(500)
      .attr('width', this.dailyCompletionPercent + '%');
  }
  async updateCalendarActivity(month: any, year: any) {
    this.monthlyGoals = await this.goalsService.getMonthlyGoals(month, year);
    const today = new Date();
    this.monthlyGoals.forEach((day: any) => {
      const current_date = new Date(year, month, new Date(day.date).getDate());
      //formatting date to match mui calendar date
      const current_date_str = `${current_date.toLocaleDateString('default', { month: 'long'})} ${new Date(day.date).getDate()}, ${current_date.getFullYear()}`;
      const mat_day = this.renderer.selectRootElement(`[aria-label="${current_date_str}"]`, true);
      this.renderer.addClass(mat_day, day.totalSessionDurationInMin < 30 ? 'inactive-day' : 'active-day');
    });
    if(month === new Date().getMonth() && year === new Date().getFullYear()) {
      const current_day_str = `${today.toLocaleDateString('default', { month: 'long'})} ${today.getDate()}, ${today.getFullYear()}`;
      const current_day = this.renderer.selectRootElement(`[aria-label="${current_day_str}"]`, true);
      this.renderer.addClass(current_day, 'today');
    }
  }
  roundMaxGoal(duration: number) {
    if(duration < 60) return Math.ceil(duration/30.0) * 30;
    return Math.ceil(duration/60.0) * 60;
  }
  toggleIndicatorOnOverlap() {
    if(Math.abs(this.dailyGoalPercent - this.dailyCompletionPercent) <= 15) {
      const current_indicator = this.renderer.selectRootElement(`.daily-goals-progress .current p`, true);
      this.renderer.addClass(current_indicator, 'invisible');
    }
    if(Math.abs(this.monthlyGoalPercent - this.monthlyCompletionPercent) <= 15) {
      const current_indicator = this.renderer.selectRootElement(`.monthly-goals-progress .current p`, true);
      this.renderer.addClass(current_indicator, 'invisible');
    }
  }
}
//custom calendar header
@Component({
  selector: 'example-header',
  template: `
    <div class="example-header w-full d-flex flex-column">
      <div class="year-container w-full p-1 p-xxl-3 mb-2 d-flex justify-content-between align-items-center">
          <i class="fa fa-chevron-left month-year-btn" (click)="previousClicked('year')"></i>
          <span class="example-header-label d-inline-block h2">{{yearLabel}}</span>
          <i class="fa fa-chevron-right month-year-btn" (click)="nextClicked('year')"></i>
      </div>
      <div class="month-container w-full p-1 p-xxl-3 d-flex justify-content-between align-items-center border-top-2">
        <span class="example-header-label d-inline-block font-bold h3 text-uppercase">{{monthLabel}}</span>
        <div>
          <i class="fa fa-chevron-left month-year-btn me-4" (click)="previousClicked('month')"></i>
          <i class="fa fa-chevron-right month-year-btn" (click)="nextClicked('month')"></i>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExampleHeader<D> {
  constructor(
      private _calendar: MatCalendar<D>, 
      private _dateAdapter: DateAdapter<D>, 
      cdr: ChangeDetectorRef,
      private calendarService: CalendarService
  ) {
  _calendar.stateChanges
      .subscribe(() => cdr.markForCheck());
  }

  get monthLabel() {
    const months = this._dateAdapter.getMonthNames('long');
    return months[this._dateAdapter.getMonth(this._calendar.activeDate)];
  }

  get yearLabel() {
    return this._dateAdapter.getYear(this._calendar.activeDate);
  }

  previousClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
        this._dateAdapter.addCalendarMonths(this._calendar.activeDate, -1) :
        this._dateAdapter.addCalendarYears(this._calendar.activeDate, -1);
    this.calendarService.monthChangeClick(this._dateAdapter.getMonth(this._calendar.activeDate), this._dateAdapter.getYear(this._calendar.activeDate));  
  }

  nextClicked(mode: 'month' | 'year') {
    this._calendar.activeDate = mode === 'month' ?
        this._dateAdapter.addCalendarMonths(this._calendar.activeDate, 1) :
        this._dateAdapter.addCalendarYears(this._calendar.activeDate, 1);
    this.calendarService.monthChangeClick(this._dateAdapter.getMonth(this._calendar.activeDate), this._dateAdapter.getYear(this._calendar.activeDate));  
  }
}
