import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {Sort} from '@angular/material';
declare var $: any;

@Component({
  selector: 'app-create-statistics',
  templateUrl: './create-statistics.component.html',
  styleUrls: ['./create-statistics.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateStatisticsComponent implements OnInit {
  @Output() onCreate: EventEmitter<any> = new EventEmitter<any>();
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
  allLeagueOfLegendRegions = [{regionName: 'Brazil', regionCode:'br1'}, 
  {regionName:'EU North East', regionCode:'eun1'},
  {regionName:'EU West', regionCode:'euw1'},
  {regionName:'Japan', regionCode:'jp1'},
  {regionName:'Korea', regionCode:'kr'},
  {regionName:'North America', regionCode:'na1'},
  {regionName:'Oceana', regionCode:'oc1'},
  {regionName:'Russia', regionCode:'ru'}];
  selectedLeagueOfLegendsRegion;
  allOverwatchPlatforms = ['PC', 'Xbox One', 'PlayStation 4'];
  specificStatistics: any = { //this is for use when generating the average stat card
    Leagueoflegends : Object,
    Runescape : Object,
    OldschoolRunescape : Object,
    Overwatch : Object,
    WorldofWarcraft : Object
  }

  allLeagueOfLegendsAverages = [];
  allOverwatchAverages = [];
  allRunescapeAverages = [];
  allOldSchoolRunescapeAverages = [];
  allWorldOfWarcraftAverages = [];

  averageStats = []

  usersRunescapeStat = [];
  usersLeagueOfLegendStat = [];
  usersOldschoolRunescapeStat = [];
  usersOverwatchStat = [];

  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public barChartLabels: string[] = ["100", "333", "32", "53", "54"];
  public barChartType: string = 'bar';
  public barChartLegend: boolean = true;

  public barChartData: any[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
    // {data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B'}
  ];

  public doughnutChartLabels: string[] = ["Top", "Jungle", "Mid", "Bottom", "Other"];
  public doughnutChartData: number[] = [100, 333, 32, 53, 54];
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

    this.updateStats();


  }

  //taken from angular material documentation page
//   sortData(sort: Sort, items) {
//     const data = items.slice();
//     if (!sort.active || sort.direction == '') {
//       this.sortedData = data;
//       return;
//     }
//     this.sortedData = data.sort((a, b) => {
//       let isAsc = sort.direction == 'asc';
//       switch (sort.active) {
//         case 'title': return compare(a.title, b.title, isAsc);
//         case 'author': return compare(+a.author, +b.author, isAsc);
//         case 'category': return compare(+a.category, +b.category, isAsc);
//         case 'price': return compare(+a.price, +b.price, isAsc);
//         case 'stock': return compare(+a.stock, +b.stock, isAsc);
//         case 'discount': return compare(+a.discount, +b.discount, isAsc);
//         default: return 0;
//       }
//     });
    
// function compare(a, b, isAsc) {
//   return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
// }
//   }

//updates stats when this is called, This method should be called everytime user craetes or updates stats
updateStats()
{
//this grabs all the stats and all the games then assigns each of the users statistics to the corresponding variable of the object specificStatistcs
    //this is so we can use the specific stats for specific games in the template withought having to call method calls in the template which is bad practice
    this.getAllStatisticsForLoggedInUser(statistics =>{
      this.getGames(games =>{

        this.getStatsForSpecificGame('Overwatch', statistics, games, (specificStat =>{
          this.specificStatistics.Overwatch = specificStat; //this one is for use in average stat Card generation
          this.usersOverwatchStat = specificStat //this is for use when displaying data 
        }));

         this.getStatsForSpecificGame('Leagueoflegends', statistics, games, (specificStat =>{
          this.specificStatistics.Leagueoflegends = specificStat;
          this.doughnutChartData = this.convertObjectToArray(this.specificStatistics.Leagueoflegends.detailGameData.lanes) //for use in the doughnut chart
      
          
         }));
         
         this.getStatsForSpecificGame('Runescape', statistics, games, (specificStat =>{
          this.specificStatistics.Runescape = specificStat;
          var runescapeSkillNames = (Object.getOwnPropertyNames(specificStat.detailGameData.skills)) //grabs the name of all the runescape skills
          this.usersRunescapeStat = this.convertObjectToArray(specificStat.detailGameData.skills)//need to convert all runescape skills to array in order to display efficently
   
         
          for(var i = 0; i<  runescapeSkillNames.length; i++){ //joins runescape skill names and object data together
             var capitalizedSkillName =  this.capitalizeFirstLetter(runescapeSkillNames[i]);
            this.usersRunescapeStat[i]["skillName"] =  capitalizedSkillName; //this.userrunescapestat will be used in html to loop through all skills
          }
        }));

         this.getStatsForSpecificGame('Oldschool Runescape', statistics, games, (specificStat =>{
          this.specificStatistics.OldschoolRunescape= specificStat;
          var runescapeSkillNames = (Object.getOwnPropertyNames(specificStat.detailGameData.skills)) //grabs the name of all the runescape skills
          this.usersOldschoolRunescapeStat = this.convertObjectToArray(specificStat.detailGameData.skills)//need to convert all runescape skills to array in order to display efficently
         
          for(var i = 0; i<  runescapeSkillNames.length; i++){ //joins runescape skill names and object data together
            var capitalizedSkillName =  this.capitalizeFirstLetter(runescapeSkillNames[i]);
            this.usersOldschoolRunescapeStat[i]["skillName"] =  capitalizedSkillName; //this.userrunescapestat will be used in html to loop through all skills
          }
        
         }));

         this.getStatsForSpecificGame('World of Warcraft', statistics, games, (specificStat =>{
          this.specificStatistics.WorldofWarcraft = specificStat;
         }));
        
      
      }); 
    });
  
    this.updateOrCreateAllAverages();

    //normally we should never do this we should instead of making 5 objects we should make 1 object
    //and put all of these into one object, however we were having trouble with accessing it on the backend with express
    //and could not figure out how to work it
    //so this populates the 5 average game arrays with each average data
    const LeagueOfLegends =
      {
        game: 'Leagueoflegends'
      }
      const Overwatch =
      {
        game: 'Overwatch'
      }
      const Runescape =
      {
       game: 'Runescape'
      }
      const OldschoolRunescape =
      {
        game: 'Oldschool Runescape'
      }
      const WorldOfWarcraft =
      {
        game: 'World of Warcraft'
      }

     
    this.authService.getAllAverageStatsByGame(LeagueOfLegends).subscribe(data => {
     this.allLeagueOfLegendsAverages = data.averageStatsForGame;
    });
    this.authService.getAllAverageStatsByGame(Overwatch).subscribe(data => {
      this.allOverwatchAverages = data.averageStatsForGame;
     });
     this.authService.getAllAverageStatsByGame(Runescape).subscribe(data => {
      this.allRunescapeAverages = data.averageStatsForGame;
     });
     this.authService.getAllAverageStatsByGame(OldschoolRunescape).subscribe(data => {
      this.allOldSchoolRunescapeAverages = data.averageStatsForGame;
     });
     this.authService.getAllAverageStatsByGame(WorldOfWarcraft).subscribe(data => {
      this.allWorldOfWarcraftAverages = data.averageStatsForGame;
     });

    

}
//converst object passed in to array
convertObjectToArray(object){
  var array = $.map(object, function(value, index) {
    return [value];
});
  return array;
}

//capitilize first letter of parameter string
capitalizeFirstLetter(string) {
  
  return string.charAt(0).toUpperCase() + string.slice(1);
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
      statistics["region"] = this.selectedLeagueOfLegendsRegion;
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
    var completeLocation = tier1.concat("," + tier2, "," + tier3, "," + tier4, "," + tier5);
    const averageData =
      {
        game: selectedGame,
        completeLocation: completeLocation
      }

  
    this.authService.getAverageForAStat(averageData).subscribe(data => {
      if (!data.success || data.averageStat == null) { //we have error checking in routes as well but just as a backup

      }
      else {

   
        const averageStats = {
          game: data.gameObj,
          statName: statString,
          average: data.averageStat,
          completeLocation: completeLocation
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
    this.getAverageStat('Overwatch', 'Best Kill Streak', 'detailGameData', 'quickplay', 'global', 'kill_streak_best', undefined);
    this.getAverageStat('Overwatch', 'Best MultiKill', 'detailGameData', 'quickplay', 'global', 'multikill_best', undefined);
    this.getAverageStat('Overwatch', 'Most Damage Done in Game', 'detailGameData', 'quickplay', 'global', 'hero_damage_done_most_in_game', undefined);
    this.getAverageStat('Overwatch', 'Total Medals', 'detailGameData', 'quickplay', 'global', 'medals', undefined);
    this.getAverageStat('World of Warcraft', 'Total Honorable Kills', 'detailGameData', 'totalHonorableKills', undefined, undefined, undefined);
    this.getAverageStat('World of Warcraft', '3v3 Arena Rating', 'detailGameData', 'pvp', 'brackets', 'ARENA_BRACKET_3v3', 'rating');
    this.getAverageStat('Leagueoflegends', 'Summoner Level', 'detailGameData', 'summonerLevel', undefined, undefined, undefined);
    this.getAverageStat('Leagueoflegends', 'Total Games This Season', 'detailGameData', 'totalGames', undefined, undefined, undefined);
    // this.getAverageStat('Overwatch', 'Competitive Best Kill Streak', 'detailGameData', 'competitive', 'global', 'kill_streak_best', undefined);
    // this.getAverageStat('Overwatch', 'Competitive Most Damage Done in Game', 'detailGameData', 'competitive', 'global', 'hero_damage_done_most_in_game', undefined);
  }

  //this is run after it has been confirmed the user for that game exists and the user does not already have a statistic of this kind created
  //once this criteria is met then we create the actual statistic object
  createStatisticObject(detailedStats) {
   
    this.authService.createStatistics(detailedStats).subscribe(data => {
      this.updateStats();
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


  getGames(callback) {
   
    this.authService.getAllGames().subscribe(data => {

      this.games = data.games;
      callback(data.games);
    });
      
    
  }


  getAllStatisticsForLoggedInUser(callback) {

    this.authService.getAllStatisticsForLoggedInUser(this.user).subscribe(data => {
      var j = 0;
      for (var i = 0; i < data.statistics.length; i++) {
        j = j + 1
        this.statistics.push(data.statistics[i][0]);
      }
      if(j == data.statistics.length)
      callback(this.statistics);

    });
  }

  //this checks to see if the statistics object is the same statistics object for the game for which the gameName is passed. This is used as a validation check in the html angular
  validateCertainGameAndStats(game, stat, gameName) {
    if (game == undefined || stat == undefined) {
    }
    else {


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

  //gets a specfiic statistic from the users statistic to compare the the specficic average stat.
  getSpecificUserStat(usersStat, averageStat) {
    var splitUpLocation = averageStat.completeLocation.split(',');
    var usersSpecificStat
  

    const statLocationTier1 = splitUpLocation[0];
    const statLocationTier2 = splitUpLocation[1];
    const statLocationTier3 = splitUpLocation[2];
    const statLocationTier4 = splitUpLocation[3];
    const statLocationTier5 = splitUpLocation[4];

    if (statLocationTier2 == 'undefined') {
      usersSpecificStat =  parseInt(usersStat[statLocationTier1]);
    }
    else if (statLocationTier3 == 'undefined') {
      usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2]);
    }
    else if (statLocationTier4 == 'undefined') {
      usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2][statLocationTier3]);
    }
    else if (statLocationTier5 == 'undefined') {
      usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2][statLocationTier3][statLocationTier4]);
    }
    else {
      usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2][statLocationTier3][statLocationTier4][statLocationTier5]);
    }

    if (usersSpecificStat.isNullOrUndefined) {
      console.log("Average Stat failed to find for user")
      return undefined;
    }
    else {

      return usersSpecificStat;
    }


  }

  getStatsForSpecificGame(gameName, allUserStatistcs, allGames, callback) {
    var foundGame;



    //loop through all games and check to see if the game name is equal to the name set in the paramter
    allGames.forEach(function(singleGame){
      if (singleGame.name == gameName){
         foundGame = singleGame; //if found then assign that game to found game

      
         //loop through all stats for that user. if stats has same game as game above. then thats the stats we are looking for. return that
         allUserStatistcs.forEach(function(singleStat){
          if(singleStat.game == foundGame._id)
         callback(singleStat);
         });
      }
      
    });

  }
 

  generateCard(averageStat, logo, stat) {

    //this is data we pass to backend to retrieve the users specific stat data
    const statData = {
      averageStat : averageStat,
      usersStat : stat
    }
    
   

    // this.authService.getSpecificUserStat(statData).subscribe(specificUserStat =>{
  
    //   });
    //   const data = {
    //     statName: averageStat.statName,
    //     average: averageStat.average,
    //     userStat: specificUserStat.usersSpecificStat,
    //     logo: logo,
    //     user: this.user
  
    //   }
       const workingData = {
      statName: averageStat.statName,
      average: averageStat.average,
      userStat: this.getSpecificUserStat(stat, averageStat),
      logo: logo,
      user: this.user

    }
      // console.log(data);
      return workingData;
     
      
    

   
   
   

 

  }






}


