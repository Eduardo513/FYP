import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


@Component({
  selector: 'app-create-statistics',
  templateUrl: './create-statistics.component.html',
  styleUrls: ['./create-statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateStatisticsComponent implements OnInit {
  statistics = [];
  allStatisticsAverageTimePlayed = [];
  user = JSON.parse(localStorage.getItem('user'));
  game: Object;
  test;
  games;
  selectedRealm;
  selectedRegion
  allRealms = [];
  allRegions = ['eu', 'us', 'kr', 'tw'];

  public doughnutChartLabels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales'];
  public doughnutChartData: number[] = [350, 450, 100];
  public doughnutChartType: string = 'doughnut';

  public chartClicked(e: any): void {
    console.log(e);
  }

  public chartHovered(e: any): void {
    console.log(e);
  }



  constructor(
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    //grabs all the realms for world of warcraft and sorts any arrays to be displayd
    this.authService.getWorldOfWarcraftRealms().subscribe(data => {
      if (data.success)
        this.allRealms = data.realms;
    });

    this.getAllStatistics();
    this.getGames();





  }


  onCreateStatisticSubmit(selectedGame, username) {







    //This is to check if the user is inputing a valid username, but it wont work - see related validate service method
    /*  
     //Required Fields
     if(this.validateService.validateUsername(this.username))
     {
       this.flashMessage.show('Please enter in a valid username', {cssClass: 'alert-danger', timeout: 3000});
      return false;
     }
     */

    //[disabled]="!isValid()"

    const statistics =
      {
        username: username,
        game: selectedGame,
        id: this.user.id
      }

    switch (selectedGame) {

      case "Leagueoflegends":
        this.authService.getLeagueOfLegends(statistics).subscribe(data => {
          if (data.success) {
            this.createStatisticObject(data);
          }
          else {
            this.flashMessageOutput(data);
          }
        });
        break;

      case "Oldschool Runescape":
        this.authService.getOldschoolRunescape(statistics).subscribe(data => {
          if (data.success) {
            this.createStatisticObject(data);
          }
          else {
            this.flashMessageOutput(data);
          }
        });
        break;

      case "Runescape":
        this.authService.getRunescape(statistics).subscribe(data => {
          if (data.success) {
            this.createStatisticObject(data);
          }
          else {
            this.flashMessageOutput(data);
          }
        });
        break;

      case "Overwatch":
        this.authService.getOverwatch(statistics).subscribe(data => {
          if (data.success) {
            this.createStatisticObject(data);
          }
          else {
            this.flashMessageOutput(data);
          }
        });
        break;

      case "World of Warcraft":
        //wow requires a custom data as it needs realm and region for api to work
        statistics["region"] = this.selectedRegion;
        statistics["realm"] = this.selectedRealm;
        this.authService.getWorldOfWarcraft(statistics).subscribe(data => {
          if (data.success) {
            this.createStatisticObject(data);
          }
          else {
            this.flashMessageOutput(data);
          }
        });
        break;


    }
   
  }

  //this is run after it has been confirmed the user for that game exists and the user does not already have a statistic of this kind created
  //once this criteria is met then we create the actual statistic object
  createStatisticObject(detailedStats) {
    this.authService.createStatistics(detailedStats).subscribe(data => {
      this.flashMessageOutput(data);

    });

  }

  flashMessageOutput(data) {
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


  getAllStatistics() {

    this.authService.getAllStatistics(this.user).subscribe(data => {

      for (var i = 0; i < data.statistics.length; i++) {
        this.statistics.push(data.statistics[i][0]);
      }


    });
  }

  //this checks to see if the statistics object is the same statistics object for the game for which the gameName is passed. This is used as a validation check in the html angular
  validateCertainGameAndStats(game, stat, gameName) {
    if (game.name == gameName && game._id == stat.game)
      return true;
  }

  isValid(username) {

    if (username == undefined) {
      return false;
    }
    else
      return true
  }






}


