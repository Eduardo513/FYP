import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import {FormControl} from '@angular/forms';


@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PartyComponent implements OnInit {
  selectedFriends = [];
  minDate;
  user = JSON.parse(localStorage.getItem('user'));
  friends = [];
  multipleFriends = new FormControl();
  selectedDate;
  selectedGame;
  games;
  selectedAccessibility;
  accessibilityOptions = [
    'Public',
    'Private', ]



  constructor(private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getAllFriends();
    this.getDate();
    this.getGames();
  }

getAllFriends(){
    this.authService.getAllFriends(this.user).subscribe(data =>{
      for(var i = 0; i < data.friends.length; i++)
      {
        this.friends.push(data.friends[i][0]);
      }

    });

  }

  getDate(){//grabs current date and assinged in to mindate so user can not select a date in the past.
    var utc = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    var formattedDate = new Date(utc);
    this.minDate = formattedDate;
    
 
  }

  submitForm(){
    var isPartyPublic;

    if(this.selectedAccessibility == "Public"){
      isPartyPublic = true;
    }
    else{
      isPartyPublic = false;
    }

    const party =
    {
      partyCreator: this.user,
      partyMembers: this.selectedFriends,
      game: this.selectedGame,
      date: this.selectedDate,
      accessibility: isPartyPublic
    }

    this.authService.createParty(party).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
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
