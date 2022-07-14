import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { JwtService } from 'src/app/services/jwt.service';
import { UserService } from 'src/app/services/user.service';

interface InterestsDTO {
  title: string;
  img: string;
  selected: boolean;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  errors = [];
  code: string = "";
  email: string = "";
  password: string = "";
  nickname: string = "";
  showPassword: boolean = false;
  carouselSlide: number = 1;
  signupStep: number = 3;
  interestStep: number = 1;
  interests: InterestsDTO[] = [
    { title: 'Classical', img: '/assets/images/interests/interest-0.png', selected: false },
    { title: 'Rock', img: '/assets/images/interests/interest-1.jpg', selected: false },
    { title: 'Jazz', img: '/assets/images/interests/interest-2.jpg', selected: false },
    { title: 'Blues', img: '/assets/images/interests/interest-3.jpg', selected: false },
    { title: 'Folk', img: '/assets/images/interests/interest-4.jpg', selected: false },
    { title: 'Dance', img: '/assets/images/interests/interest-5.jpg', selected: false },
    { title: 'Popular', img: '/assets/images/interests/interest-6.jpg', selected: false },
    { title: 'Country', img: '/assets/images/interests/interest-7.jpg', selected: false },
    { title: "50's", img: '/assets/images/interests/interest-8.jpg', selected: false },
    { title: "60's", img: '/assets/images/interests/interest-9.jpg', selected: false },
    { title: "70's", img: '/assets/images/interests/interest-10.jpg', selected: false },
  ]
  activities: InterestsDTO[] = [
    { title: 'Singing', img: '/assets/images/activities/0.jpg', selected: false },
    { title: 'Dancing', img: '/assets/images/activities/1.jpg', selected: false },
    { title: 'Socializing', img: '/assets/images/activities/2.jpg', selected: false },
    { title: 'Music Listening', img: '/assets/images/activities/3.jpg', selected: false },
    { title: 'Fitness', img: '/assets/images/activities/4.jpg', selected: false },
    { title: 'Problem Solving', img: '/assets/images/activities/5.jpg', selected: false },
    { title: 'Walking', img: '/assets/images/activities/6.jpg', selected: false },
    { title: 'Meditating', img: '/assets/images/activities/7.jpg', selected: false },
    { title: 'Artwork', img: '/assets/images/activities/8.jpg', selected: false },
    { title: 'Viewing Films', img: '/assets/images/activities/9.jpg', selected: false },
    { title: 'Reading', img: '/assets/images/activities/10.jpg', selected: false },
  ];
  reminderTimes: any = {
    'Morning' : false,
    'Afternoon' : false,
    'Evening' : false,
    'Night' : false,
    // 'custom' : [],
  };
  customTime: boolean = false;
  selectedTime!: string;
  signUpLink = ''
  loginLink = ''

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private jwtService: JwtService,
    private authService: AuthService,
    private userService: UserService,
  ) {
    this.signUpLink = this.authService.getSignupLink();
    this.loginLink = this.authService.getLoginLink();
    router.events.subscribe(() => {
      let step = parseInt(this.route.snapshot.paramMap.get('step')!);
      let interest = parseInt(this.route.snapshot.paramMap.get('interest') || '');
      if(step === -1) router.navigate(['/app/home']);
      this.signupStep = step;
      if(interest) this.interestStep = interest;
    })
  }

  ngOnInit(): void {    
    this.code = this.userService.get().id || "";
    this.email = this.userService.get().email || "";

    const step = this.route.snapshot.paramMap.get('step')
    if (step) {
      this.signupStep = +step;
    }

    setInterval(() => {
      if (this.carouselSlide === 3) this.carouselSlide = 1;
      else this.carouselSlide++;
    }, 4000);
  }
  validateEmail() {
    return this.email
    .toLowerCase()
    .match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
  }
  toggleShowPassword() {
    this.showPassword = !this.showPassword;
  }
  checkPasswordStrength(password: string) {
    if(/^(?=.*[A-Za-z])(?=.*[!@#$%^&*_0-9])[A-Za-z\d@$!%*#?&]{16,}$/g.test(password)) {
      return "Strong"; // atleast 16 characters
    }
    else if(/^(?=.*[A-Za-z])(?=.*[!@#$%^&*_0-9])[A-Za-z\d@$!%*#?&]{10,}$/g.test(password)) {
      return "Good"; // atleast 10 characters
    }
    else if(/^(?=.*[A-Za-z])(?=.*[!@#$%^&*_0-9])[A-Za-z\d@$!%*#?&]{6,}$/g.test(password)) {
      return "Fair"; // atleast 6 characters with atleast 1 number or special character
    } 
    else {
      return "Weak";
    }
  }

  updateCarouselSlide(slide: number) {
    this.carouselSlide = slide;
  }

  async setNickName() {
    const res = await this.authService.setNickName({ 
      nickname: this.nickname,
    });
    if(res.response && res.response.errors) {
      this.errors = res.response.errors.map((err: any) => err.message)
    }else {
      this.changeStep(this.signupStep+1);
    }
  }

  changeStep(step: number, interest?: number) {
    this.signupStep = step;
    if(interest) {
      this.router.navigate(['app/signup/' + step + '/' + interest]);
    } else {
      this.router.navigate(['/app/signup/' + step]);
    }
  }

  goBack() {
    this.changeStep(this.signupStep-1);
  }

  goBackInterest() {
    if(this.interestStep > 1) {
      this.changeStep(this.signupStep, this.interestStep-1);
    } else {
      this.changeStep(this.signupStep-1);
    }
  }

  async nextSignupStep() {
    this.errors = [];
    if(this.signupStep === 3) {
        const res = await this.authService.signup({ 
            nickname: this.nickname, 
          });
        if(res.response && res.response.errors) {
          this.errors = res.response.errors.map((err: any) => err.message)
        }else {
          this.userService.setPatient(res.signUpPatient.patient);
          this.jwtService.setToken(res.signUpPatient.token);
          this.changeStep(this.signupStep+1);
        }

    }
    else if(this.signupStep === 4) {
      this.changeStep(this.signupStep+1, this.interestStep);
    }
    else {
      this.changeStep(this.signupStep+1);
    }
  }
  goToHome() {
    this.router.navigate(['/app/home']);
  }

  async nextInterestStep() {
    this.errors = [];
    if(this.interestStep === 1) {
      let genres: any = {};
      this.interests.forEach(item => {
        if(item.selected) {
          genres[item.title] = true;
        }
      })
      const res = await this.authService.setPreferredGenres({ genres, id: this.userService.get().id})
      if(res.response && res.response.errors) {
        this.errors = res.response.errors.map((err: any) => err.message)
      }else {
        this.changeStep(this.signupStep, this.interestStep+1);
      }
    }
    else if(this.interestStep === 2) {
      let activities: any = {};
      this.activities.forEach(item => {
        if(item.selected) {
          activities[item.title] = true;
        }
      })
      const res = await this.authService.setPreferredActivities({ activities, id: this.userService.get().id})
      if(res.response && res.response.errors) {
        this.errors = res.response.errors.map((err: any) => err.message)
      }else {
        this.changeStep(this.signupStep, this.interestStep+1);
      }
    }
    else if(this.interestStep === 3) {
      this.goToHome();
    } else {
      this.changeStep(this.signupStep, this.interestStep+1);
    }
  }
  selectInterest(i: number) {
    this.interests[i].selected = !this.interests[i].selected;
  }
  selectActivity(i: number) {
    this.activities[i].selected = !this.activities[i].selected;
  }
  
  selectTime(i: number) {
    if(i === 4) {
      this.toggleCustomTime();
      return;
    }
    let curr: any = Object.keys(this.reminderTimes)[i];
    this.reminderTimes[curr] = !this.reminderTimes[curr];
    this.selectedTime = curr;
  }
  toggleCustomTime() {
    this.selectedTime = '';
    this.customTime = !this.customTime;
  }
  addCustomTime() {
    if(this.selectedTime) {
      this.reminderTimes.custom.push(this.selectedTime);
    }
    this.toggleCustomTime();
  }
  getCustomTime() {
    if(this.reminderTimes.custom.length > 0) {
      let customTimes = this.reminderTimes.custom.map((time: any) => {
        var [h,m] : any[] = time.split(":");
        [h,m] = [parseInt(h), parseInt(m)];
        return h%12+(h%12 == 0 ? 12 : 0)+":"+m + " "  + (h >= 12 ? 'PM' : 'AM');
      });
      return customTimes.length > 0 ? customTimes.join(', ') : false;
    } else {
      return false;
    }
  }
  originalOrder = (a: KeyValue<string, any>, b: KeyValue<string, any>): number => {
    return 0;
  }
  showNext() {
    if(this.interestStep === 1) {
      return this.interests.filter((item: any) => item.selected).length > 2;
    } else if(this.interestStep === 2) {
      return this.activities.filter((item: any) => item.selected).length > 2;
    } else {
      return Object.values(this.reminderTimes).filter((item: any) => item === true || item.length).length;
    }
  }
}
