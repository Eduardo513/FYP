import { Component, OnInit, Input } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-stats-card',
  templateUrl: './stats-card.component.html',
  styleUrls: ['./stats-card.component.css']
})
export class StatsCardComponent implements OnInit {

  @Input('data') data: any;
  viewingUserIsLoggedIn: boolean = false;
  currentStatFavourited:boolean; //this variable holds whether stat is already favourited

  //these variables decide whether the users stat is a gold rating stat which means it is 20 percent higher then the average/
  // silver stat: between the average by a margin of 20 percent
  //bronze stat: below the average by 20 percent
  goldStat = false;
  silverStat=  false;
  bronzeStat = false;

  constructor(private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }
  // data = {
  //   statName : "multiple kills",
  //   average : 55,
  //   userAverage : 60,
  //   logo: '/assets/images/overwatchLogo.jpg',
  //   user: user
  // }

  ngOnInit() {
    var loggedInUser = JSON.parse(localStorage.getItem('user'))

    if(this.data.user.username == loggedInUser.username) //this is so we can see if the person vieiwng the card is the user thats logged in or not so we can have different functionalities 
    this.viewingUserIsLoggedIn = true

    this.checkFavouriteStatStatus()
    this.checkUsersStatComparedToAverage();
  
  }

  checkUsersStatComparedToAverage(){
    var goldRating = this.data.average*1.1;
    var silverRating = this.data.average;
    var bronzeRating = this.data.average*0.9;
    console.log("gold :" + goldRating)
    console.log("silver :" + silverRating)
    console.log("bronze :" + bronzeRating)

    if(this.data.userStat >= goldRating)
    this.goldStat = true;

    if(this.data.userStat < goldRating && this.data.userStat > bronzeRating)
    this.silverStat = true;

    if(this.data.userStat <= bronzeRating)
    this.bronzeStat = true;

  }



  //sees if the stat is already favourited by the user
  checkFavouriteStatStatus(){
    var userId;
    
        //passing in id in two different formats so we check which format is coming in here
        if(this.data.user._id == undefined)
          userId = this.data.user.id
        
        else
        userId = this.data.user._id
        
    
        const dataForStat = {
          userId : userId,
          statName: this.data.statName
        }
        this.authService.getFavouriteStatLikeStatus(dataForStat).subscribe(data =>{
          if (data.success) {
           this.currentStatFavourited = data.status;
          }
          else {
            this.currentStatFavourited = data.status;
          }
        });
      }
  

  removeFavouriteStat(){
    var userId;
    
        //passing in id in two different formats so we check which format is coming in here
        if(this.data.user._id == undefined)
          userId = this.data.user.id
        
        else
        userId = this.data.user._id
        
    
        const dataForStat = {
          userId : userId,
          statName: this.data.statName
        }
        this.authService.removeFavouriteStat(dataForStat).subscribe(data =>{
          if (data.success) {
            this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
          }
          else {
            this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
          }
        });
    
      }
  


  addFavouriteStat(){
    var userId;

    //passing in id in two different formats so we check which format is coming in here
    if(this.data.user._id == undefined)
      userId = this.data.user.id
    
    else
    userId = this.data.user._id
    

    const dataForStat = {
      userId : userId,
      statName: this.data.statName
    }
    this.authService.addFavouriteStat(dataForStat).subscribe(data =>{
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
      }
      else {
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
    });

  }

}
