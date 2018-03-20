import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;
  @Input('user') viewingUser: any;
  favouriteStats = [];
  allCardDataForUser = [];
  editProfile: boolean = false;
  gamingSince;
  favouriteGame;
  bio;
 

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {

    if (this.viewingUser == undefined) {
      var loggedInUser = JSON.parse(localStorage.getItem('user'))

      this.authService.getUserObjectById(loggedInUser).subscribe(data => {
        if (data.success) {

          this.viewingUser = data.userObj;
          this.gamingSince = this.viewingUser.gamingSince;
          this.favouriteGame = this.viewingUser.favouriteGame;
          this.bio = this.viewingUser.bio;
          this.getUsersFavouriteStats(data.userObj);
        }
      });
    }





    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      })


  }

  updateViewingUser(){
    var loggedInUser = JSON.parse(localStorage.getItem('user'))
    this.authService.getUserObjectById(loggedInUser).subscribe(data => {
      if (data.success) {
        this.viewingUser = data.userObj;
      }
    });

  }

  toggleEditFalse() {
    this.editProfile = false;
  }

  toggleEditTrue() {
    this.editProfile = true;
  }

  editUser() {
    
    const editedUserData = {
      id: this.viewingUser._id,
      bio: this.bio,
      favouriteGame: this.favouriteGame,
      gamingSince: this.gamingSince
    }
    console.log(editedUserData)
    this.toggleEditFalse();
    this.authService.editUserProfileData(editedUserData).subscribe(data => {
      if (data.success) {

        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
        this.updateViewingUser();//reloads user data with fresh edited data
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }

    });
  
  }

  getUsersFavouriteStats(user) {


    for (var i = 0; i < user.favouriteStats.length; i++) {
      const dataForStats = {
        favouriteStatId: user.favouriteStats[i],
        userId: user._id

      }

      this.authService.getAverageStatById(dataForStats).subscribe(data => {
        if (data.success) {

          this.favouriteStats.push(data.averageStatObject); //this is so we have a record of all the averagestats that the user favorited
          dataForStats["averageStat"] = data.averageStatObject; //this is so we can pass it into getspecificuserstat paramter


          this.authService.getSpecificUserStat(dataForStats).subscribe(data => {
            if (data.success) {

              var cardData = {
                statName: data.averageStat.statName,
                average: data.averageStat.average,
                userStat: data.usersSpecificStat,
                logo: '',
                user: user
              }

              //retrieves the logo for specific game
              this.authService.getLogoForGame(data.averageStat).subscribe(data => {
                cardData.logo = data.logo;
                this.allCardDataForUser.push(cardData)
              });



              this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
            }
            else {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
          });

        }

      });
    }

  }

}
