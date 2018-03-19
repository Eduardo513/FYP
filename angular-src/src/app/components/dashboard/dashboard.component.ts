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
  user = JSON.parse(localStorage.getItem('user'));
  statistics = []; //holds all the statistics objects for logged in user
  friends = []; //holds all the user objects which the logged in user is friends with
  friendRequests =[];
  games;
  game;
  selectedFriend: String;
  id;
  username: String;

  constructor(
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getAllStatistics();
   

  
  }


  getAllStatistics(){
    this.authService.getAllStatisticsForLoggedInUser(this.user).subscribe(data =>{
      for(var i = 0; i < data.statistics.length; i++)
      {
       this.statistics.push(data.statistics[i][0]);
      }
   });
  }

  


}
