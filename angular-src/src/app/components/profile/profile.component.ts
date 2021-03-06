import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { YoutubePlayerModule } from 'ng2-youtube-player';
var moment = require('moment');


declare var $: any;

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  youtubeUrlId;
  UrlLoaded = false;
  private player;
  private ytEvent;

  user: Object;
  @Input('user') viewingUser: any;
  private sub: any;
  favouriteStats = [];
  allCardDataForUser = [];
  editProfile: boolean = false;
  gamingSince;
  favouriteGame;
  youtubeClipURL;
  bio;
  viewingUserIsLoggedIn: boolean = false; //boolean to see if the user currently seeing the profile is the logged in user
  selectedLogo;
  myLogo;
  logos = [
    {logo: 'assets/images/Rift_profile_logo.png', gameName: "rift"},
    { logo: '/assets/images/leagueOfLegendsLogo2.png', gameName: "leagueOfLegends" },
    { logo: '/assets/images/overwatchLogo.jpg', gameName: "overwatch" },
    { logo: '/assets/images/runescapeLogo.png', gameName: "runescape" },
    { logo: '/assets/images/oldschoolRunescapeLogo.jpg', gameName: "oldschoolRunescape" },
    { logo: '/assets/images/World-of-WarcraftLogo.png', gameName: "worldOfWarcraft" },

  ]

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    var addclass = 'color';
    var $cols = $('.divs').click(function (e) {
      $cols.removeClass(addclass);
      $(this).addClass(addclass);
    });

    $('img').click(function () {
      $('.selected').removeClass('selected');
      $(this).addClass('selected');
    });



    //grabs user from params if they got here from somewhere else. If its the logged in user then populate fields with that user data
    this.sub = this.route.params.subscribe(params => {
      if (params['userId'] == undefined) {
        this.viewingUserIsLoggedIn = true;
        this.updateViewingUser(JSON.parse(localStorage.getItem('user')))
      }
      else {

        const user = {
          id: params['userId']
        }
        this.updateViewingUser(user)
      }
    });






    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
      err => {
        console.log(err);
        return false;
      })


  }

  updateViewingUser(user) {

    this.authService.getUserObjectById(user).subscribe(data => {
      if (data.success) {
        this.viewingUser = data.userObj;
   
      
   
        this.gamingSince = this.viewingUser.gamingSince;
        this.favouriteGame = this.viewingUser.favouriteGame;
        this.bio = this.viewingUser.bio;

        if(this.viewingUser.favouriteClip == undefined)
          this.youtubeUrlId =  'TXul5WDzvOs'   
        else
        this.youtubeUrlId =  this.viewingUser.favouriteClip;
        this.UrlLoaded = true

        if (this.favouriteStats.length == 0) //this is so we dont keep adding to the array of favourited stats everytime we edit details
          this.getUsersFavouriteStats(data.userObj);

      }
    });

  }

  toggleEditFalse() {
    this.editProfile = false;
  }

  toggleEditTrue() {
    this.editProfile = true;
  }

  getLogos() {

  }

  editUser() {
    var chosenLogo = this.myLogo;
    var chosenLogoLocation;
    var youtubeClipId;


    if(chosenLogo !=undefined){
    this.logos.forEach(function (logoObject) {
      if (logoObject.gameName == chosenLogo) {
        chosenLogoLocation = logoObject.logo
      }
    });
  }
  else{
    chosenLogoLocation = 'assets/images/GCLogo.png'
  }
    if(this.youtubeClipURL != undefined){
    youtubeClipId = this.YouTubeGetID(this.youtubeClipURL);
    }
    else
    youtubeClipId = this.viewingUser.favouriteClip;

    
    var gamingSinceFormatted = moment(this.gamingSince).format("dddd, MMMM Do YYYY");
    const editedUserData = {
      id: this.viewingUser._id,
      bio: this.bio,
      favouriteGame: this.favouriteGame,
      gamingSince: gamingSinceFormatted,
      profilePicture: chosenLogoLocation,
      favouriteClip: youtubeClipId

    }
    this.toggleEditFalse();
    this.authService.editUserProfileData(editedUserData).subscribe(data => {
      if (data.success) {

        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
        this.updateViewingUser(JSON.parse(localStorage.getItem('user')));//reloads user data with fresh edited data
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
                user: user,
                viewingUserIsLoggedIn: this.viewingUserIsLoggedIn
              }


              //retrieves the logo for specific game
              this.authService.getLogoForGame(data.averageStat).subscribe(data => {
                cardData.logo = data.logo;
                this.allCardDataForUser.push(cardData)
              });




            }
            else {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
          });

        }

      });
    }

  }

  //taken from https://gist.github.com/takien/4077195/
 YouTubeGetID(url){
    var ID = '';
    url = url.replace(/(>|<)/gi,'').split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    if(url[2] !== undefined) {
      ID = url[2].split(/[^0-9a-z_\-]/i);
      ID = ID[0];
    }
    else {
      ID = url;
    }
      return ID;
  }
  

  onStateChange(event) {
    this.ytEvent = event.data;
  }
  savePlayer(player) {
    this.player = player;
  }

  playVideo() {
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

}
