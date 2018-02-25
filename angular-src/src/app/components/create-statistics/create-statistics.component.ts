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
  statistics: Object;
  user;
  game: Object;
  test: String;
  games;




  constructor(
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getGames();


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
    this.user = JSON.parse(localStorage.getItem('user'));


    const statistics =
      {
        username: this.username,
        game: this.game,
        id: this.user.id
      }

    //Register Statistic
    this.authService.createStatistics(statistics).subscribe(data => {
      if (data.success) {
        //now calls league of legends api and passes the statistic data to it
        if(this.game == "Leagueoflegends"){
        this.authService.getLeagueOfLegends(data).subscribe(data => {

          if (data.success) {
            this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
          }
          else {
            this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
          }

        });
      }
      //change this to else if or a switch statment once include more games
      else{
        this.authService.getRunescape(data).subscribe(data => {
          
                    if (data.success) {
                      this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
                    }
                    else {
                      this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
                    }
          
                  });
      }

      }
      else {
        this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 3000 });

      }
    });

  }


  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;
    });
  }

}


