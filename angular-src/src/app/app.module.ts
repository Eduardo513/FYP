import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule, Routes} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModules } from './material.module'; //imports all of materials from the materials module
import { ChartsModule } from 'ng2-charts';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { GenericTableModule } from 'angular-generic-table';
import { ImageUploadModule } from "angular2-image-upload";
import { CalendarModule } from 'angular-calendar';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { YoutubePlayerModule } from 'ng2-youtube-player';



// import {MatButtonModule, MatCheckboxModule} from '@angular/material';
// import {MatRadioModule} from '@angular/material/radio';
// import {MatFormFieldModule} from '@angular/material/form-field';
// import {MatSelectModule} from '@angular/material/select';
// import {MatIconModule} from '@angular/material/icon';
// import {MatDatepickerModule} from '@angular/material/datepicker';
// import {MatNativeDateModule} from '@angular/material'; //this is an implementation of the datepicker above that allows us to take in user input as javascript date objects when selecting from a calender
// import {MatInputModule} from '@angular/material';
// import {MatTabsModule} from '@angular/material/tabs';
// import {MatTableModule} from '@angular/material/table';


import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { ProfileComponent } from './components/profile/profile.component';

import {ValidateService} from './services/validate.service';
import {FlashMessagesModule} from 'angular2-flash-messages';
import {AuthService} from './services/auth.service';
import {AuthGuard} from './guards/auth.guard';
import { CreateGameComponent } from './components/create-game/create-game.component';
import { CreateStatisticsComponent } from './components/create-statistics/create-statistics.component';
import { PartyComponent } from './components/party/party.component';
import { StatsCardComponent } from './components/stats-card/stats-card.component';
import { FriendViewComponent } from './components/friend-view/friend-view.component';
import { PartyDialogComponent } from './components/party-dialog/party-dialog.component';



const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'create-statistics', component: CreateStatisticsComponent, canActivate:[AuthGuard]},
  {path: 'party', component: PartyComponent, canActivate:[AuthGuard]},
  {path: 'create-game', component: CreateGameComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'profile', component: ProfileComponent, canActivate:[AuthGuard]},
  {path: 'friends', component: FriendViewComponent, canActivate:[AuthGuard]}
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    ProfileComponent,
    CreateGameComponent,
    CreateStatisticsComponent,
    PartyComponent,
    StatsCardComponent,
    FriendViewComponent,
    PartyDialogComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule,
    BrowserAnimationsModule,
    AppMaterialModules,
    ChartsModule,
    OwlDateTimeModule, 
    OwlNativeDateTimeModule,
    GenericTableModule,
    ImageUploadModule.forRoot(),
    CalendarModule.forRoot(),
    NgbModule.forRoot(),
    YoutubePlayerModule,

    
    // MatButtonModule,
    // MatRadioModule, 
    // MatCheckboxModule,
    // MatFormFieldModule,
    // MatSelectModule,
    // MatIconModule,
    // MatDatepickerModule,
    // MatNativeDateModule,
    // MatInputModule,
    // MatTabsModule,
    // MatTableModule
  ],
  providers: [ValidateService, AuthService, AuthGuard, ],
  bootstrap: [AppComponent],
  entryComponents: [PartyDialogComponent]
})
export class AppModule { }
