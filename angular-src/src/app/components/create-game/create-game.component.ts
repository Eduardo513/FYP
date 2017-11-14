import { Component, OnInit } from '@angular/core';
import {FlashMessagesService} from 'angular2-flash-messages';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.css']
})
export class CreateGameComponent implements OnInit {
  name: String;
  genre: String;

  constructor(
    private router:Router,
    private authService: AuthService,
    private flashMessage:FlashMessagesService ) { }

  ngOnInit() {
  }

  onCreateGameSubmit()
  {
    const game =
    {
      name: this.name,
      genre: this.genre
    }
  

  //Register User
  this.authService.createGame(game).subscribe(data => {
    if(data.success)
    {
      this.flashMessage.show('Game has been created', {cssClass: 'alert-success', timeout: 3000});
   
    }
    else
    {
      this.flashMessage.show('Something went wrong', {cssClass: 'alert-success', timeout: 3000});
      
    }
  });

}
}
