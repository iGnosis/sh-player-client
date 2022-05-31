import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatIconModule} from '@angular/material/icon';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoginPageComponent } from './pages/auth/login-page/login-page.component';
import { HomeComponent } from './pages/app/home/home.component';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SessionComponent } from './pages/app/session/session.component';
import { SafePipe } from './pipes/safe/safe.pipe';
import { StoreModule } from '@ngrx/store';
import { homeReducer } from './store/reducers/home.reducer';
import { PrivateGuard } from './guards/private-guard';
import { PublicGuard } from './guards/public-guard';
@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    LoginPageComponent,
    HomeComponent,
    NavBarComponent,
    SessionComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    CarouselModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({
      home: homeReducer
    })
  ],
  providers: [
    PrivateGuard,
    PublicGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
