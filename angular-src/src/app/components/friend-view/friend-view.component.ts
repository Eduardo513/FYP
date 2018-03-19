import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { GtConfig } from 'angular-generic-table';

export interface RowData {
  id: number;
  name: string;
  lucky_number: number;
}

@Component({
  selector: 'app-friend-view',
  templateUrl: './friend-view.component.html',
  styleUrls: ['./friend-view.component.css']
})
export class FriendViewComponent implements OnInit {
  loaded: boolean = false;
  addingFriendUsername;
  user = JSON.parse(localStorage.getItem('user'));
  friendsList = [];
  friendRequestsList = [];
  constructor(private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService
  
  ) { }

  ngOnInit() {
    this.getAllFriends()
    this.getAllFriendRequests()

    console.log(this.friendRequestsList);

  
}

  getAllFriends(){
    this.authService.getAllFriends(this.user).subscribe(data =>{
      for(var i = 0; i < data.friends.length; i++)
      {
        this.friendsList.push(data.friends[i][0]);
      }

    });
    this.loaded = true;

  }

  getAllFriendRequests(){
    
      this.authService.getAllFriendRequests(this.user).subscribe(data =>{
        for(var i = 0; i < data.friendRequests.length; i++)
        {
          this.friendRequestsList.push(data.friendRequests[i][0]);
          
          
        }
      });
    }

    acceptFriendRequest(friendRequest){
      
        const friendData = 
        {
          //logged in users id
          id: this.user.id,
          //username for friend user selected in front end
          selectedFriendUsername: friendRequest.username
          
        }
        
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

      addFriend(addingFriendUsername){
        
            if(addingFriendUsername == this.user.username)
            {
              this.flashMessage.show("You can't add yourself!",{
                cssClass: 'alert-danger',
                 timeout: 5000});
            }
            else{
        
            
            
            const friendData = 
            {
              id: this.user.id,
              username: addingFriendUsername
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
