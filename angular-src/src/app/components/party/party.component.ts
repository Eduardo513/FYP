import { Component, Inject, OnInit, ViewEncapsulation, ViewChild, TemplateRef, ChangeDetectionStrategy } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FormControl } from '@angular/forms';
import { DataSource } from '@angular/cdk/collections';
import { Observable } from 'rxjs/Observable';
import { OwlDateTimeModule, OWL_DATE_TIME_FORMATS} from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'ng-pick-datetime-moment';
import 'rxjs/add/observable/of';
import { MatTableDataSource, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
  CalendarEvent,
  CalendarMonthViewDay,
  CalendarEventAction,
  CalendarEventTimesChangedEvent
} from 'angular-calendar';
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
import { PartyDialogComponent } from 'app/components/party-dialog/party-dialog.component';
import { Subject } from 'rxjs/Subject';
var moment = require('moment');
var readableParty = [];

interface DisplayParty {
  partyId: string;
  partyCreator: string;
  game: string;
  startDate: string;
  participants: number;
  title: string
}


@Component({
  selector: 'app-party',
  templateUrl: './party.component.html',
  styleUrls: ['./party.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class PartyComponent implements OnInit {
  view: string = 'month';
  viewDate: Date = new Date();
  activeDayIsOpen: boolean = false;

  selectedPartyTitle;
  selectedFriends = [];
  dt1;
  public selectedMoment = new Date();
  minDate;
  user = JSON.parse(localStorage.getItem('user'));
  friends = [];
  multipleFriends = new FormControl();
  selectedDate: Date;
  selectedGame;
  games;
  allPublicParties = []
  selectedAccessibility;
  accessibilityOptions = [
    'Public',
    'Private',]
    refresh: Subject<any> = new Subject();



  columns = [
    { columnDef: 'name', header: 'Party Creator', cell: (element: any) => `${element.partyCreator}` },
    { columnDef: 'participants', header: 'Number Of Participants', cell: (element: any) => `${element.participants}` },
    { columnDef: 'game', header: 'Game', cell: (element: any) => `${element.game}` },
    { columnDef: 'startDate', header: 'Start Date', cell: (element: any) => `${element.startDate}` },
  ];

  displayedColumns = this.columns.map(c => c.columnDef);

  dataSource = new MatTableDataSource();


  constructor(private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    public dialog: MatDialog) { }

    events: CalendarEvent[] = []
      
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

  //refreshes after loading all the events
   public refreshView(): void {
      this.refresh.next();
    }
  //click event
    handleEvent(event: CalendarEvent): void {
      this.openDialog(event)
  
  
    }
  


  public openDialog(partyData): void {
    this.dialog.open(PartyDialogComponent, { data: partyData });
  }

  ngOnInit() {


    this.getAllFriends();
    this.getDate();
    this.getGames();
    this.updateData();
    
     


  }

  //instead of refreshing the page we just call this method to repopulate all the data on the page
  updateData(){
    this.getPublicPartiesWithoutUser(this.allPublicParties);
    this.getAllPartiesForUser();
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
    
    var displayDate = moment(this.selectedMoment).format("dddd, MMMM Do YYYY, h:mm a");
    var startDate = moment(this.selectedMoment)
    

    var isPartyPublic;
    //var formattedDate = this.selectedDate.toISOString().substring(0, 10)

    // var newDate = this.selectedMoment.toISOString().replace('Z', '').replace('T', '  ');
   // console.log(formattedDate);
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
        date: startDate,
        accessibility: isPartyPublic,
        title: this.selectedPartyTitle,
        displayDate: displayDate
      }


    this.authService.createParty(party).subscribe(data => {

      if (data.success) {
        this.refreshView();
        this.updateData();
        this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
      }
      else {
        this.flashMessage.show('Something went wrong', { cssClass: 'alert-danger', timeout: 3000 });

      }
    });


  }



  getPublicPartiesWithoutUser(allPublicParties) {
    allPublicParties = [];

    this.authService.getAllPublicPartiesWithoutUser(this.user).subscribe(data => {

      if (data.success) {
        this.populateCalender(data.parties,'#ad2121');

        for (var i = 0; i < data.parties.length; i++) {
          this.authService.getPartyInString(data.parties[i]).subscribe(data => {
            allPublicParties.push(data.readableData);
          });



        }
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



  getAllPartiesForUser() {
    
    var allPartiesForUser
    var displayParty: DisplayParty;

    this.authService.getAllPartiesForUser(this.user).subscribe(data => {
      if (data.success) 
      {
         this.populateCalender(data.allUserParties, '#0a682c')
    }
  });
}

  populateCalender(parties, primaryColor){
    var allPartiesForUser
    var displayParty: DisplayParty;
    this.events = []; //reset parties
    for (var i = 0; i < parties.length; i++) {
      this.authService.getPartyInString(parties[i]).subscribe(data => {
        displayParty = data.readableData
    
        this.events.push({
          title: displayParty.title,
          start: new Date(displayParty.startDate),
          color: {
            primary: primaryColor,
            secondary: '#FAE3E3'
          },
          meta: {
            displayParty
          },
        });
        this.refreshView();//refreshes after loading the events
      });

    }
  }

  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;

    });
  }
}

 
