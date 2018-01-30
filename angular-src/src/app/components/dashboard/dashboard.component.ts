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
  statistics = [];
  games;
  stat1 = [];
  username = [];
  game;
  id;

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
      for(var i = 0; i < data.statistics.length; i++)
      {
  
        this.stat1.push(JSON.stringify(data.statistics[i][0]));
       this.statistics.push(JSON.parse(this.stat1[i]));
       
       
      }
      console.log(this.statistics[1]);
 
   });

  }


}
