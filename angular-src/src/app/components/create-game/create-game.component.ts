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
  user = JSON.parse(localStorage.getItem('user'));
  constructor(
    private router:Router,
    private authService: AuthService,
    private flashMessage:FlashMessagesService ) { }

  ngOnInit() {
    this.onCreateGameSubmit()
  }

  onCreateGameSubmit()
  {
    if(this.user.username != 'admin'){
      this.router.navigate(['/']);
    }
    else
{
  
  

  //Register Game
  this.authService.createGame().subscribe(data => {
    if(data.success)
    {
      this.flashMessage.show('Game has been created', {cssClass: 'alert-success', timeout: 3000});
   
    }
    else
    {
      this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
      
    }
  });
  }
}
}
