import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { GqlConstants } from 'src/app/services/gql-constants/gql-constants.constants';
import { GraphqlService } from 'src/app/services/graphql/graphql.service';

@Component({
  selector: 'feedback-form',
  templateUrl: './feedback-form.component.html',
  styleUrls: ['./feedback-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('200ms ease-out', style({ transform: 'translateX(0%)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)' })),
      ]),
    ]),
  ],
})
export class FeedbackFormComponent implements OnInit {
  @Input() show: boolean | null = false;
  formId: string = '';

  formGroup = new FormGroup({
    response: new FormArray([
      new FormGroup({
        question: new FormControl('How are you feeling now?'),
        answer: new FormControl('', [Validators.required]),
      }),
      new FormGroup({
        question: new FormControl('How was your overall experience today?'),
        answer: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
      }),
      new FormGroup({
        question: new FormControl('What did you like the most?'),
        answer: new FormControl('', [Validators.required]),
      }),
      new FormGroup({
        question: new FormControl('Which activity did you enjoy the most today?'),
        answer: new FormControl('', [Validators.required]),
      }),
      new FormGroup({
        question: new FormControl('What did you enjoy about the activity?'),
        answer: new FormControl('', [Validators.required]),
      }),
      new FormGroup({
        question: new FormControl('Which activity was the least enjoyable today?'),
        answer: new FormControl('', [Validators.required]),
      }),
      new FormGroup({
        question: new FormControl('What did you dislike about the activity?'),
        answer: new FormControl('', [Validators.required]),
      }),
    ]),
  });

  moodList = [
    {
      title: "Irritated",
      icon:`<svg width="40" height="40" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M51.3125 61.9844C49.7969 63.4062 47.4219 63.3281 46.0156 61.8125C44.8594 60.5781 42.875 59.25 40 59.25C37.125 59.25 35.1406 60.5781 33.9844 61.8125C32.5781 63.3281 30.2031 63.4062 28.6875 61.9844C27.1719 60.5781 27.0938 58.2031 28.5156 56.6875C30.7344 54.2969 34.5938 51.75 40 51.75C45.4062 51.75 49.2656 54.2969 51.4844 56.6875C52.9062 58.2031 52.8281 60.5781 51.3125 61.9844ZM22.5625 38C22.5625 36.625 23.1094 35.375 24.0156 34.4688L19.2031 32.875C17.9062 32.4375 17.1875 31.0156 17.625 29.7031C18.0625 28.4062 19.4844 27.6875 20.7969 28.125L35.7969 33.125C37.0938 33.5625 37.6719 34.9844 37.375 36.2969C36.9375 37.5938 35.5156 38.1719 34.2031 37.875L32.5156 37.3125C32.5469 37.5312 32.5625 37.7656 32.5625 38C32.5625 40.7656 30.3125 43 27.5625 43C24.8125 43 22.5625 40.7656 22.5625 38ZM57.5625 38C57.5625 40.7656 55.3125 43 52.5625 43C49.8125 43 47.5625 40.7656 47.5625 38C47.5625 37.75 47.5781 37.5 47.6094 37.2656L45.7969 37.875C44.4844 38.1719 43.0625 37.5938 42.625 36.2969C42.1875 34.9844 42.9062 33.5625 44.2031 33.125L59.2031 28.125C60.5156 27.6875 61.9375 28.4062 62.375 29.7031C62.6719 31.0156 62.0938 32.4375 60.7969 32.875L56.0781 34.4375C56.9844 35.3438 57.5625 36.6094 57.5625 38ZM0 40.5C0 18.4062 17.9062 0.5 40 0.5C62.0938 0.5 80 18.4062 80 40.5C80 62.5938 62.0938 80.5 40 80.5C17.9062 80.5 0 62.5938 0 40.5ZM40 73C57.9531 73 72.5 58.4531 72.5 40.5C72.5 22.5469 57.9531 8 40 8C22.0469 8 7.5 22.5469 7.5 40.5C7.5 58.4531 22.0469 73 40 73Z" fill="#2D3748"/>
      </svg>`,
    },
    {
      title: "Anxious",
      icon: `
      <svg width="40" height="40" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M53.75 45.5C58.5781 45.5 62.5 49.4219 62.5 54.25C62.5 59.0781 58.5781 63 53.75 63H26.25C21.4219 63 17.5 59.0781 17.5 54.25C17.5 49.4219 21.4219 45.5 26.25 45.5H53.75ZM26.25 50.5C24.1719 50.5 22.5 52.1719 22.5 54.25C22.5 56.3281 24.1719 58 26.25 58H27.5V50.5H26.25ZM32.5 58H37.5V50.5H32.5V58ZM47.5 50.5H42.5V58H47.5V50.5ZM52.5 58H53.75C55.8281 58 57.5 56.3281 57.5 54.25C57.5 52.1719 55.8281 50.5 53.75 50.5H52.5V58ZM32.5625 33C32.5625 35.7656 30.3125 38 27.5625 38C24.8125 38 22.5625 35.7656 22.5625 33C22.5625 30.2344 24.7969 28 27.5625 28C30.3281 28 32.5625 30.2344 32.5625 33ZM47.5625 33C47.5625 30.2344 49.7969 28 52.5625 28C55.3281 28 57.5625 30.2344 57.5625 33C57.5625 35.7656 55.3125 38 52.5625 38C49.8125 38 47.5625 35.7656 47.5625 33ZM0 40.5C0 18.4062 17.9062 0.5 40 0.5C62.0938 0.5 80 18.4062 80 40.5C80 62.5938 62.0938 80.5 40 80.5C17.9062 80.5 0 62.5938 0 40.5ZM40 8C22.0469 8 7.5 22.5469 7.5 40.5C7.5 58.4531 22.0469 73 40 73C57.9531 73 72.5 58.4531 72.5 40.5C72.5 22.5469 57.9531 8 40 8Z" fill="#2D3748"/>
      </svg>`,
    },
    {
      title: "Okay",
      icon: `
      <svg width="40" height="40" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.5625 33C22.5625 30.2344 24.7969 28 27.5625 28C30.3281 28 32.5625 30.2344 32.5625 33C32.5625 35.7656 30.3125 38 27.5625 38C24.8125 38 22.5625 35.7656 22.5625 33ZM57.5625 33C57.5625 35.7656 55.3125 38 52.5625 38C49.8125 38 47.5625 35.7656 47.5625 33C47.5625 30.2344 49.7969 28 52.5625 28C55.3281 28 57.5625 30.2344 57.5625 33ZM51.25 51.75C53.3281 51.75 55 53.4219 55 55.5C55 57.5781 53.3281 59.25 51.25 59.25H28.75C26.6719 59.25 25 57.5781 25 55.5C25 53.4219 26.6719 51.75 28.75 51.75H51.25ZM80 40.5C80 62.5938 62.0938 80.5 40 80.5C17.9062 80.5 0 62.5938 0 40.5C0 18.4062 17.9062 0.5 40 0.5C62.0938 0.5 80 18.4062 80 40.5ZM40 73C57.9531 73 72.5 58.4531 72.5 40.5C72.5 22.5469 57.9531 8 40 8C22.0469 8 7.5 22.5469 7.5 40.5C7.5 58.4531 22.0469 73 40 73Z" fill="#2D3748"/>
      </svg>`,
    },
    {
      title: "Happy",
      icon: `
      <svg width="40" height="40" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M54.6094 48.6875C57.5312 47.8594 60.2188 50.5625 58.4531 53.0781C54.75 59.0313 47.8594 62.8594 39.9844 62.8594C32.1094 62.8594 25.2344 59.0313 21.3906 53.0781C19.7656 50.5625 22.4531 47.8594 25.3594 48.6875C29.8906 49.7344 34.8125 50.3125 39.9844 50.3125C45.1562 50.3125 50.0938 49.7344 54.6094 48.6875ZM32.5625 33C32.5625 35.7656 30.3125 38 27.5625 38C24.8125 38 22.5625 35.7656 22.5625 33C22.5625 30.2344 24.7969 28 27.5625 28C30.3281 28 32.5625 30.2344 32.5625 33ZM47.5625 33C47.5625 30.2344 49.7969 28 52.5625 28C55.3281 28 57.5625 30.2344 57.5625 33C57.5625 35.7656 55.3125 38 52.5625 38C49.8125 38 47.5625 35.7656 47.5625 33ZM80 40.5C80 62.5938 62.0938 80.5 40 80.5C17.9062 80.5 0 62.5938 0 40.5C0 18.4062 17.9062 0.5 40 0.5C62.0938 0.5 80 18.4062 80 40.5ZM40 8C22.0469 8 7.5 22.5469 7.5 40.5C7.5 58.4531 22.0469 73 40 73C57.9531 73 72.5 58.4531 72.5 40.5C72.5 22.5469 57.9531 8 40 8Z" fill="#2D3748"/>
      </svg>`,
    },
    {
      title: "Daring",
      icon: `
      <svg width="40" height="40" viewBox="0 0 80 81" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M31.2188 26.6406L37.1719 27.4219C37.5156 27.4844 38.0469 27.8125 38.2031 28.2813C38.3438 28.7344 38.2188 29.2344 37.875 29.5625L33.5156 33.7031L34.6094 39.6094C34.6875 40.0938 34.5 40.5625 34.1094 40.8438C33.7188 41.1406 33.2031 41.1719 32.7812 40.9375L27.3594 38.0781L22.2188 40.9375C21.7969 41.1719 21.2812 41.1406 20.8906 40.8438C20.5 40.5625 20.1719 40.0938 20.3906 39.6094L21.4844 33.7031L17.125 29.5625C16.7812 29.2344 16.6562 28.7344 16.7969 28.2813C16.9531 27.8125 17.3438 27.4844 17.8281 27.4219L23.7812 26.6406L26.375 21.2188C26.5781 20.7812 27.0156 20.5 27.3594 20.5C27.9844 20.5 28.4219 20.7812 28.625 21.2188L31.2188 26.6406ZM56.2188 26.6406L62.1719 27.4219C62.5156 27.4844 63.0469 27.8125 63.2031 28.2813C63.3438 28.7344 63.2188 29.2344 62.875 29.5625L58.5156 33.7031L59.6094 39.6094C59.6875 40.0938 59.5 40.5625 59.1094 40.8438C58.7188 41.1406 58.2031 41.1719 57.7812 40.9375L52.5 38.0781L47.2188 40.9375C46.7969 41.1719 46.2812 41.1406 45.8906 40.8438C45.5 40.5625 45.1719 40.0938 45.3906 39.6094L46.4844 33.7031L42.125 29.5625C41.7812 29.2344 41.6562 28.7344 41.7969 28.2813C41.9531 27.8125 42.3438 27.4844 42.8281 27.4219L48.7812 26.6406L51.375 21.2188C51.5781 20.7812 52.0156 20.5 52.5 20.5C52.9844 20.5 53.4219 20.7812 53.625 21.2188L56.2188 26.6406ZM54.6094 48.6875C57.5312 47.8594 60.2188 50.5625 58.4531 53.0781C54.75 59.0313 47.8594 62.8594 39.9844 62.8594C32.1094 62.8594 25.2344 59.0313 21.3906 53.0781C19.7656 50.5625 22.4531 47.8594 25.3594 48.6875C29.8906 49.7344 34.8125 50.3125 39.9844 50.3125C45.1562 50.3125 50.0938 49.7344 54.6094 48.6875ZM0 40.5C0 18.4062 17.9062 0.5 40 0.5C62.0938 0.5 80 18.4062 80 40.5C80 62.5938 62.0938 80.5 40 80.5C17.9062 80.5 0 62.5938 0 40.5ZM40 73C57.9531 73 72.5 58.4531 72.5 40.5C72.5 22.5469 57.9531 8 40 8C22.0469 8 7.5 22.5469 7.5 40.5C7.5 58.4531 22.0469 73 40 73Z" fill="#2D3748"/>
      </svg>`,
    },
  ];

  gameList = [
    {
      title: "Sit, Stand, Achieve",
      img: '../../../../assets/images/game-icons/sit-stand-achieve.svg',
    },
    {
      title: "Beat Boxer",
      img: '../../../../assets/images/game-icons/beat-boxer.svg',
    },
    {
      title: "Sound Explorer",
      img: '../../../../assets/images/game-icons/sound-explorer.svg',
    },
    {
      title: "Moving Tones",
      img: '../../../../assets/images/game-icons/moving-tones.svg',
    },
  ];

  constructor(private graphqlService: GraphqlService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {}

  async sendPatientFeedback() {
    if (this.formId) {
      await this.graphqlService.gqlRequest(GqlConstants.UPDATE_PATIENT_FEEDBACK, {
        response: this.formGroup.get('response')?.value,
        id: this.formId,
      });
    } else {
      const response = await this.graphqlService.gqlRequest(GqlConstants.INSERT_PATIENT_FEEDBACK, {
        response: this.formGroup.get('response')?.value,
      });

      this.formId = response.insert_patient_feedback.returning[0].id;
    }
  }

  getForm(idx: number): AbstractControl {
    return this.formGroup.get('response')?.get([idx]) || new FormControl();
  }

  setFormValue(idx: number, value: string | number) {
    this.formGroup.get('response')?.get([idx])?.get('answer')?.setValue(value);
    this.formGroup.get('response')?.get([idx])?.get('question')?.markAsTouched();
  }

  getFormAnswer(idx: number): string | number {
    return this.formGroup.get('response')?.get([idx])?.get('answer')?.value || '';
  }

}
