import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { MatTableDataSource } from '@angular/material';


var readableParty = [];



@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PartyComponent implements OnInit {
  
  selectedFriends = [];
  dt1;
  public selectedMoment = new Date();
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
    'Private',]




  columns = [
    { columnDef: 'name', header: 'Party Creator', cell: (element: any) => `${element.partyCreator}` },
    { columnDef: 'numOfParticipants', header: 'Number Of Participants', cell: (element: any) => `${element.numOfParticipants}` },
    { columnDef: 'game', header: 'Game', cell: (element: any) => `${element.game}` },
    { columnDef: 'startDate', header: 'Start Date', cell: (element: any) => `${element.startDate}` },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

  dataSource = new MatTableDataSource();


  constructor(private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  

    this.getAllFriends();
    this.getDate();
    this.getGames();
    this.getPublicParties(readableParty);
    console.log(this.selectedMoment);







    //creates a promise that will resolve the array of parties after 1 second 
    //possible refactor would be to have set timeout to know when the array is finished populating instead of just waiting one second
    //but after 3 days of attempting to populate this table I am settling with this
    const myPromise = new Promise<any>((resolve, reject) => {
      setTimeout(function () {

        resolve(readableParty);
      }, 1000)

    });


    //sets up an observable stream to look at the promise once it is resolved
    //not sure if observable is needed here, potentially just use promise instead but according to angular material table api
    // we have to use either observable, array or connnect()-disconnect()
    const parties$ = Observable.fromPromise(myPromise);


    //subscribes to the observable and sets the datasource of the table to the result of the observable stream.

    parties$.subscribe(x => {


      this.dataSource.data = x;

    });



  }

  getAllFriends() {
    this.authService.getAllFriends(this.user).subscribe(data => {
      for (var i = 0; i < data.friends.length; i++) {
        this.friends.push(data.friends[i][0]);
      }

    });

  }

  getDate() {//grabs current date and assinged in to mindate so user can not select a date in the past.
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var formattedDate = new Date(utc);
    this.minDate = formattedDate;


  }

  submitForm() {
    var isPartyPublic;
    var newDate = this.selectedMoment.toISOString().replace('Z', '').replace('T', '  ');
    console.log(newDate);

    if (this.selectedAccessibility == "Public") {
      isPartyPublic = true;
    }
    else {
      isPartyPublic = false;
    }

    const party =
      {
        partyCreator: this.user,
        partyMembers: this.selectedFriends,
        game: this.selectedGame,
        date: newDate,
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

  getPublicParties(array) {
 

    this.authService.getAllPublicParties().subscribe(data => {

      if (data.success) {

        for (var i = 0; i < data.parties.length; i++) {

          this.authService.getPartyInString(data.parties[i]).subscribe(data => {
            array.push(data.readableData);

            return array;

          });
        }
      }
      else {
        this.flashMessage.show(data.message, {
          cssClass: 'alert-danger',
          timeout: 5000
        });
      }
    })
  }

  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;

    });
  }
}


