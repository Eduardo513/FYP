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
import { CalendarEvent, 
  CalendarMonthViewDay,
  CalendarEventAction,
  CalendarEventTimesChangedEvent } from 'angular-calendar';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format
} from 'date-fns';



var readableParty = [];

interface DisplayParty {
  partyId: string;
  partyCreator: string;
  game: string;
  startDate: string;
  numOfParticipants: number;
}


@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PartyComponent implements OnInit {
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;

  // events: Array<CalendarEvent<{ displayParty: DisplayParty }>>;


  events: CalendarEvent[] =[
    {
      title: 'Increments badge total on the day cell',
      start: new Date(),
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3'
    }  },]
  //   {
  //     title: 'Increments bjnfngnffadge total on the day cell',
  //     start: new Date("March 25, 2018 11:13:00"),
  //     color: {
  //       primary: '#ad2121',
  //       secondary: '#FAE3E3'
  //     }}
  //   ];

  dayClicked({ date, events }: { date: Date; events: Array<CalendarEvent<{ displayParty: DisplayParty }>>; }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
        this.viewDate = date;
      }
    }
  }

  modalData: {
    action: string;
    event: CalendarEvent;
  };

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fa fa-fw fa-pencil"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      }
    },
    {
      label: '<i class="fa fa-fw fa-times"></i>',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }
  ];

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
  allPublicParties = []
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
    this.getPublicParties(this.allPublicParties);
    this.getAllPartiesForUser();
  






    //all this is for angular material table
    // this.getPublicParties(readableParty);
    //creates a promise that will resolve the array of parties after 1 second 
    //possible refactor would be to have set timeout to know when the array is finished populating instead of just waiting one second
    //but after 3 days of attempting to populate this table I am settling with this
    // const myPromise = new Promise<any>((resolve, reject) => {
    //   setTimeout(function () {

    //     resolve(readableParty);
    //   }, 1000)

    // });


    //sets up an observable stream to look at the promise once it is resolved
    //not sure if observable is needed here, potentially just use promise instead but according to angular material table api
    // we have to use either observable, array or connnect()-disconnect()
    // const parties$ = Observable.fromPromise(myPromise);


    // //subscribes to the observable and sets the datasource of the table to the result of the observable stream.

    // parties$.subscribe(x => {


    //   this.dataSource.data = x;

    // });



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
    // var newDate = this.selectedMoment.toISOString().replace('Z', '').replace('T', '  ');
    // console.log(newDate);

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

  onEdit(rowId) {
    console.log(rowId);
  }
  onDelete(rowId) {
    console.log(rowId);
  }

  getPublicParties(allPublicParties) {


    this.authService.getAllPublicParties().subscribe(data => {

      if (data.success) {


        for (var i = 0; i < data.parties.length; i++) {
          this.authService.getPartyInString(data.parties[i]).subscribe(data => {
            allPublicParties.push(data.readableData);
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

  joinParty(party) {
    const partyData = {
      loggedInUserId: this.user.id,
      partyId: party.partyId
    }
    this.authService.joinParty(partyData).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success', timeout: 5000
        });
      }

      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger', timeout: 5000
        });
      }
    });

  }

  //this is the method for the angular material table
  // getPublicParties(array) {


  //   this.authService.getAllPublicParties().subscribe(data => {

  //     if (data.success) {


  //       for (var i = 0; i < data.parties.length; i++) {

  //         this.authService.getPartyInString(data.parties[i]).subscribe(data => {
  //           console.log(data.readableData);
  //           this.allPublicParties.push(data.readableData);
  //           array.push(data.readableData);


  //           return array;

  //         });
  //       }
  //     }
  //     else {
  //       this.flashMessage.show(data.message, {
  //         cssClass: 'alert-danger',
  //         timeout: 5000
  //       });
  //     }
  //   })
  // }

  getAllPartiesForUser() {
    var allPartiesForUser
    var displayParty:DisplayParty;
    this.authService.getAllPartiesForUser(this.user).subscribe(data => {
      if (data.success) {
        for (var i = 0; i < data.allUserParties.length; i++) {
          this.authService.getPartyInString(data.allUserParties[i]).subscribe(data => {
          console.log(data.readableData)
            displayParty = data.readableData
          this.events.push( {
            title: 'Increments bherhrgwradge total on the day cell',
            start: new Date(displayParty.startDate),
            color: {
              primary: '#ad2121',
              secondary: '#FAE3E3'
          },
          meta: {
           displayParty
          },
           });
         
         console.log(this.events)
          });

        }
      }
      else {

      }
    });
  }

  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;

    });
  }
}


