import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FlashMessagesService } from 'angular2-flash-messages';
import { ValidateService } from '../../services/validate.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
var moment = require('moment');
@Component({
  selector: 'app-party-dialog',
  templateUrl: './party-dialog.component.html',
  styleUrls: ['./party-dialog.component.css']
})

export class PartyDialogComponent implements OnInit {

  constructor(private matDialogRef: MatDialogRef<PartyDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private validateService: ValidateService,
    private router: Router,
    private authService: AuthService,
    private flashMessage: FlashMessagesService) { }

  accessibilityOptions = [
    'Public',
    'Private',]
  friends = [];
  games;
  selectedMoment;
  minDate;
  friendsNotAlreadyInParty = [];//this holds all friends that are not in the party
  selectedPartyTitle;
  selectedDate;
  selectedFriends = [];
  selectedParticipants = [];
  participants = [];
  selectedGame;
  selectedAccessibility;
  editPartyToggle: boolean = false;
  isUserPartyOwner: boolean = false;
  isUserParticipant: boolean = false;
  user = JSON.parse(localStorage.getItem('user'));
  ngOnInit() {
    this.getGames();
    // this.getAllFriends();
    this.checkUserStatus();
    this.getDate();

  }

  public close() {
    this.matDialogRef.close();
  }

  //checks what relation the user has to this party
  //change this to check user id to party id - this is temporary 
  //this could do with refactor
  public checkUserStatus() {

    if (this.data.color.primary == "#0a682c") {
      if (this.data.meta.displayParty.partyCreator == this.user.username)
        this.isUserPartyOwner = true;
      else
        this.isUserParticipant = true

    }
  }

  joinParty() {
    const partyData = {
      loggedInUserId: this.user.id,
      partyId: this.data.meta.displayParty.partyId
    }
    this.authService.joinParty(partyData).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success', timeout: 5000
        });
        this.close();
      }

      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger', timeout: 5000
        });
        this.close();
      }
    });

  }
  leaveParty() {
    const partyData = {
      loggedInUserId: this.user.id,
      partyId: this.data.meta.displayParty.partyId
    }
    this.authService.leaveParty(partyData).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success', timeout: 5000
        });
        this.close();
      }

      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger', timeout: 5000
        });
        this.close();
      }
    });

  }
  editParty() {
    var localData = this.data;
    var foundGame
    //sets the game field 
    this.games.forEach(function (game, index, array) {
      if (game.name != undefined) {
        if (game.name == localData.meta.displayParty.game)
          foundGame = game;
      }
    });
//sets the accessibility field
    if (this.data.meta.displayParty.public == true)
      this.selectedAccessibility = this.accessibilityOptions[0]
    else
      this.selectedAccessibility = this.accessibilityOptions[1]

      this.selectedMoment = this.data.meta.displayParty.startDate;
    //sets other fields
    this.selectedDate = this.data.meta.displayParty.startDate;
    this.selectedPartyTitle = this.data.meta.displayParty.title;
    this.selectedGame = foundGame;
    this.editPartyToggle = true;

  }

  submitEditParty(){
    var isPartyPublic;
    if (this.selectedAccessibility == "Public") {
      isPartyPublic = true;
    }
    else {
      isPartyPublic = false;
    }


   var displayDate = moment(this.selectedMoment).format("dddd, MMMM Do YYYY, h:mm a");
   var startDate = moment(this.selectedMoment)
    
    var newPartyData ={
      id: this.data.meta.displayParty.partyId,
      title : this.selectedPartyTitle,
      date : startDate,
      game : this.selectedGame,
      public: isPartyPublic,
      displayDate: displayDate
    }

    this.authService.submitEditParty(newPartyData).subscribe(data =>{
      if (data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success', timeout: 5000
        });
        this.close();
      }

      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger', timeout: 5000
        });
        this.close();
      }

    })
  }
  deleteParty() {
    const partyData = {
      partyId: this.data.meta.displayParty.partyId
    }
    this.authService.deleteParty(partyData).subscribe(data => {
      if (data.success) {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-success', timeout: 5000
        });
        this.close();
      }

      else {
        this.flashMessage.show(data.msg, {
          cssClass: 'alert-danger', timeout: 5000
        });
        this.close();
      }
    });
  }

  getGames() {
    this.authService.getAllGames().subscribe(data => {
      this.games = data.games;

    });
  }

  getDate() {//grabs current date and assinged in to mindate so user can not select a date in the past.
    var utc = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    var formattedDate = new Date(utc);
    this.minDate = formattedDate;


  }


  //this method needs refactoring
  //grabs all friends and populates this.friends with it
  //also grabs all friends that are not included in the party and populats friendsnotalreadyinparty with them.
  // getAllFriends() {
  //   var j = 0;
  //   var allFriendIds = [];
  //   var friendsNotAlreadyInParty = [];
  //   this.authService.getAllFriends(this.user).subscribe(data => {

  //     for (var i = 0; i < data.friends.length; i++) {
  //       allFriendIds.push(data.friends[i][0]._id);
  //       this.data.meta.displayParty.participants.forEach(function(participant, index, array){
  //         console.log(allFriendIds);
  //         console.log(participant);
  //         var indexOfParticipant = allFriendIds.indexOf(participant._id)
  //         console.log(indexOfParticipant)


  //         // var currentFriendId = data.friends[i][0]._id;
  //         // console.log(data.friends[i][0]._id)
  //         // console.log(participant._id)
  //         // if(currentFriendId == participant._id)
  //         // console.log(participant);
  //       });
  //       j++;
      
       
  //       // if(j == data.friends.length){
        
  //       //   this.data.meta.displayParty.participants.forEach(function(participant, index, array){
  //       //     if((allFriends.indexOf(participant)) == -1){
  //       //       friendsNotAlreadyInParty.push(participant);
  //       //       console.log("friends not in party: " + friendsNotAlreadyInParty);
  //       //     }
  //       //   });
           
  //       }
  //     });

  //   }

  }