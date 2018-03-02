import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import {ValidateService} from '../../services/validate.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-create-statistics',
  templateUrl: './create-statistics.component.html',
  styleUrls: ['./create-statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateStatisticsComponent implements OnInit {
  username: String;
  statistics = [];
  user = JSON.parse(localStorage.getItem('user'));
  game: Object;
  test: String;
  games;
  gameSelected;




  constructor(
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
   
    this.getAllStatistics();
    this.getGames();
    
    console.log(this.statistics);


  }

  onCreateStatisticSubmit() {

    //This is to check if the user is inputing a valid username, but it wont work - see related validate service method
    /*  
     //Required Fields
     if(this.validateService.validateUsername(this.username))
     {
       this.flashMessage.show('Please enter in a valid username', {cssClass: 'alert-danger', timeout: 3000});
      return false;
     }
     */
    


    const statistics =
      {
        username: this.username,
        game: this.game,
        id: this.user.id
      }

    //Register Statistic
    this.authService.createStatistics(statistics).subscribe(data => {
      if (data.success) {
        switch(this.game){

          case "LeagueOfLegends":
          this.authService.getLeagueOfLegends(data).subscribe(data => {
            this.flashMessageOutput(data);
           });
           break;

           case "Runescape":
           this.authService.getRunescape(data).subscribe(data => {
             this.flashMessageOutput(data);
           });
           break;

           case "Overwatch":
           this.authService.getOverwatch(data).subscribe(data => {
             this.flashMessageOutput(data);
           });
           break;

           //now add all the games here.
           case "CounterStrike":
           this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
           break;

        }
      }
      else{
        this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
      }
      
      });
    }
      
        

  flashMessageOutput(data)
  {
    if (data.success) {
      this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
    }
    else {
      this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
    }
  }


  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;
    });
  }


  getAllStatistics(){
  
    this.authService.getAllStatistics(this.user).subscribe(data =>{
   
      for(var i = 0; i < data.statistics.length; i++)
      {
       this.statistics.push(data.statistics[i][0]);
      }
  
   });
  }

  //this checks to see if the statistics object is the same statistics object for the game for which the gameName is passed. This is used as a validation check in the html angular
  validateCertainGameAndStats(game, stat, gameName){
    if(game.name == gameName && game._id ==  stat.game)
    return true;
  }

}


