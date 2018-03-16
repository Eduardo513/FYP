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
    this.getAllFriends();
    this.getAllFriendRequests();

  
  }


  getAllStatistics(){
    this.authService.getAllStatisticsForLoggedInUser(this.user).subscribe(data =>{
      for(var i = 0; i < data.statistics.length; i++)
      {
       this.statistics.push(data.statistics[i][0]);
      }
   });
  }

  getAllFriends(){
    this.authService.getAllFriends(this.user).subscribe(data =>{
      for(var i = 0; i < data.friends.length; i++)
      {
        this.friends.push(data.friends[i][0]);
      }

    });

  }

  getAllFriendRequests(){
  
    this.authService.getAllFriendRequests(this.user).subscribe(data =>{
      for(var i = 0; i < data.friendRequests.length; i++)
      {
        this.friendRequests.push(data.friendRequests[i][0]);
        
        
      }
    });
  }

  onAcceptFriendRequest(){
  
    const friendData = 
    {
      //logged in users id
      id: this.user.id,
      //username for friend user selected in front end
      selectedFriendUsername: this.selectedFriend
      
    }
    console.log(friendData.selectedFriendUsername);
    this.authService.confirmFriendRequest(friendData).subscribe(data =>{

      if(data.success)
      {
        this.flashMessage.show(data.msg ,{
          cssClass: 'alert-success',
           timeout: 5000});
      }
      else{
        this.flashMessage.show(data.msg ,{
          cssClass: 'alert-danger',
           timeout: 5000});

      }
    });
  }

  onAddFriendSubmit(){

    if(this.username == this.user.username)
    {
      this.flashMessage.show("You can't add yourself!",{
        cssClass: 'alert-danger',
         timeout: 5000});
    }
    else{

    
    
    const friendData = 
    {
      id: this.user.id,
      username: this.username
    }
    this.authService.addFriend(friendData).subscribe(data =>{
      if(data.success)
      {
        this.flashMessage.show(data.msg ,{
          cssClass: 'alert-success',
           timeout: 5000});
      }
      else{
        this.flashMessage.show(data.msg ,{
          cssClass: 'alert-danger',
           timeout: 5000});

      }
    });
  }
}


}
