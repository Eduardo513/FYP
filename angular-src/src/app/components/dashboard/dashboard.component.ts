import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  user;
  statistics;
  games;
  stat1;
  username;

  constructor(
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getAllStatistics();

  
  }


  getAllStatistics(){
    this.user = JSON.parse(localStorage.getItem('user'));
    this.authService.getAllStatisticsId(this.user).subscribe(data =>{
    this.stat1 = JSON.stringify(data.statistics[0][0]);
    this.statistics = JSON.parse(this.stat1);
   
    console.log(this.user);
    console.log(this.statistics);
    this.username = this.statistics.username;
   });

  }



}
