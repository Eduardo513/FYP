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
  games;
  selectedWoWRealm;
  selectedWoWRegion
  selectedOverwatchRegion;
  selectedOverwatchPlatform;
  overwatchBattleTag;
  allWoWRealms = [];
  allWoWRegions = ['eu', 'us', 'kr', 'tw'];
  allOverwatchRegions = ['eu', 'us', 'as'];
  allOverwatchPlatforms = ['PC', 'Xbox One', 'PlayStation 4'];

  averageStats = [{
    game: String,
    stat: String,
    average: Number
  }]



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
        this.allWoWRealms = data.realms;
    });

    this.getAllStatistics();
    this.getGames();
    this.updateOrCreateAllAverages();





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
        //this switch statment so I can display nice visuals to users while sending correctly formed data to backend
        switch (this.selectedOverwatchPlatform) {
          case "PC":
            this.selectedOverwatchPlatform = "pc";
            break;

          case "Xbox One":
            this.selectedOverwatchPlatform = "xbl";
            break;

          case "PlayStation 4":
            this.selectedOverwatchPlatform = "psn";
            break;
        }
        if (this.overwatchBattleTag != undefined) {
          var battleTag = username.concat("-" + this.overwatchBattleTag); //overwatch requires the number and username together witha  dash inbetween on pc
          statistics.username = battleTag;
        }


        statistics["region"] = this.selectedOverwatchRegion;
        statistics["platform"] = this.selectedOverwatchPlatform;

        console.log(statistics);

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
        statistics["region"] = this.selectedWoWRegion;
        statistics["realm"] = this.selectedWoWRealm;
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

  //get average for a stat across all users for that game. Tiers are different levels deeper into the object
  //stat string is the name of the statistic
  getAverageStat(selectedGame, statString, tier1, tier2, tier3, tier4, tier5) {
    const averageData =
      {
        game: selectedGame,
        statLocationTier1: tier1,
        statLocationTier2: tier2,
        statLocationTier3: tier3,
        statLocationTier4: tier4,
        statLocationTier5: tier5
      }

    this.authService.getAverageForAStat(averageData).subscribe(data => {
      if (!data.success || data.averageStat == null) { //we have error checking in routes as well but just as a backup
        
      }
      else{

      
        const averageStats = {
          game: selectedGame,
          statName: statString,
          average: data.averageStat
        };
        this.authService.createOrUpdateAverageStat(averageStats).subscribe(data => {
        });
      }

    });

  }

  //this method will update all the averages for all the games so they are constantly up to date when user loads page
  //any new averages I want to add to the system I can implement here
  updateOrCreateAllAverages() {
    this.getAverageStat('Oldschool Runescape', 'Oldschool Runescape Level', 'level', undefined, undefined, undefined, undefined);
    this.getAverageStat('Runescape', 'Runescape Level', 'level', undefined, undefined, undefined, undefined);
    this.getAverageStat('Overwatch', 'QuickPlay Best Kill Streak', 'detailGameData', 'quickplay', 'global', 'kill_streak_best', undefined);
    this.getAverageStat('Overwatch', 'QuickPlay Best MultiKill', 'detailGameData', 'quickplay', 'global', 'multikill_best', undefined);
    this.getAverageStat('Overwatch', 'QuickPlay Most Damage Done in Game', 'detailGameData', 'quickplay', 'global', 'hero_damage_done_most_in_game', undefined);
    this.getAverageStat('Overwatch', 'Competitive Best Kill Streak', 'detailGameData', 'competitive', 'global', 'kill_streak_best', undefined);
    this.getAverageStat('Overwatch', 'Competitive Most Damage Done in Game', 'detailGameData', 'competitive', 'global', 'hero_damage_done_most_in_game', undefined);
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
    if(game == undefined || stat == undefined){
    }
    else{

    
    if (game.name == gameName && game._id == stat.game)
      return true;
    } 
  }

  isValid(username) {

    if (username == undefined) {
      return false;
    }
    else
      return true
  }






}


