import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import {ValidateService} from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PartyComponent implements OnInit {
  user = JSON.parse(localStorage.getItem('user'));
  friends = [];
data = {
  group1: 'Banana'
}


  constructor(private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    this.getAllFriends();
  }

getAllFriends(){
    this.authService.getAllFriends(this.user).subscribe(data =>{
      for(var i = 0; i < data.friends.length; i++)
      {
        this.friends.push(data.friends[i][0]);
      }

    });

  }
}
