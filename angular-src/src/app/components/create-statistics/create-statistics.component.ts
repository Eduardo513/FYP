import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
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
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getGames();


  }

  onCreateStatisticSubmit() {
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
        this.authService.getLeagueOfLegends(statistics).subscribe(data => {

          if (data.success) {
            this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
          }
          else {
            this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
          }

        });
        // this.flashMessage.show('Statistics has been created', {cssClass: 'alert-success', timeout: 3000});

      }
      else {
        this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 3000 });

      }
    });

  }

  getLeagueofLegends(statistics) {
    this.authService.getLeagueOfLegends(statistics).subscribe(data => {



    });
  }
  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;
    })
  }

}
