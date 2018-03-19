import { Component, OnInit, Input } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:Object;
  @Input('user') viewingUser: any;
  favouriteStats = [];
  allCardDataForUser = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {
    if(this.viewingUser == undefined){
      var loggedInUser = JSON.parse(localStorage.getItem('user'))
     
      this.authService.getUserObjectById(loggedInUser).subscribe(data=>{
        if(data.success){

        this.viewingUser = data.userObj;
        console.log(this.viewingUser)
        this.getUsersFavouriteStats(data.userObj);
        }
      });
    }
   

   

    
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
    },
  err => {
    console.log(err);
    return false;
  })


  }

  getUsersFavouriteStats(user)
  {
  
   
    for(var i = 0; i< user.favouriteStats.length; i++){
      const dataForStats = {
        favouriteStatId : user.favouriteStats[i],
        userId : user._id
    
      }
  
      this.authService.getAverageStatById(dataForStats).subscribe(data =>{
        if (data.success) {
          
          this.favouriteStats.push(data.averageStatObject); //this is so we have a record of all the averagestats that the user favorited
          dataForStats["averageStat"] = data.averageStatObject; //this is so we can pass it into getspecificuserstat paramter
        
         
          this.authService.getSpecificUserStat(dataForStats).subscribe(data=>{
            if (data.success) {
             
              var cardData ={ 
                statName : data.averageStat.statName,
                  average : data.averageStat.average,
                  userStat : data.usersSpecificStat,
                  logo: '',
                  user: user
              }

              //retrieves the logo for specific game
             this.authService.getLogoForGame(data.averageStat).subscribe(data=>{
              cardData.logo = data.logo;
              this.allCardDataForUser.push(cardData)
             });
            
              
             
            this.flashMessage.show(data.msg, { cssClass: 'alert-success', timeout: 3000 });
            }
            else {
              this.flashMessage.show(data.msg, { cssClass: 'alert-danger', timeout: 3000 });
            }
              });
               
        }
       
      });
    }
    
  }

}
