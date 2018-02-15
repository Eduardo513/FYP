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
  public = String;
  friends = [];
  multipleFriends = new FormControl();
  selectedDate;
  test = true;
  selectedAccessibility = String;
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
    for(var i = 0; i < this.selectedFriends.length; i++)
    {
      console.log(this.selectedFriends[i]);
   
    }
    console.log(this.selectedDate);
    console.log(this.selectedAccessibility);
  
  }
}
