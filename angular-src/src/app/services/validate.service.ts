import { Injectable } from '@angular/core';

@Injectable()
export class ValidateService {

  constructor() { }

  validateRegister(user)
  {
      if(user.email == undefined || user.username == undefined || user.password == undefined)
      {
        return false;
      }
      else{
        return true;
      }
  }
 
  //this regex expression check wont work for some reason when using to create statistics
  /*
  validateUsername(username)
  {
    const re = new RegExp("^[0-9\\p{L} _\\.]+$");
    if (re.test(username)) {
      console.log("Valid");
  } else {
      console.log("Invalid");
  }
  }
*/
  validateEmail(email)
  {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
  }

}
