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
    console.log(this.data);
  }

  addFavouriteStat(){
    const dataForStat = {
      userId : this.data.user.id,
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
