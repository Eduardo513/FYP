import { Injectable } from '@angular/core';
import {Http, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';


@Injectable()
export class AuthService {
  authToken: any;
  user: any;
  game: any;
  statistics: any;

  constructor(private http:Http ) { }

  registerUser(user)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/register', user, {headers: headers})
      .map(res => res.json());
  }

  createGame(game)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/games/create-game', game, {headers: headers})
      .map(res => res.json());
  }

  createStatistics(statistics)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/statistics/create-statistics', statistics, {headers: headers})
      .map(res => res.json());
  }

  authenticateUser(user)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/authenticate', user, {headers: headers})
      .map(res => res.json());
  }

  getProfile()
  {
    let headers = new Headers();
    this.loadToken();
    headers.append('Authorization', this.authToken);
    headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/users/profile', {headers: headers})
      .map(res => res.json());
  }

  getLeagueOfLegends(statistics){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/leagueoflegends', statistics, {headers: headers})
    .map(res => res.json());
  }
  
  getAllGames(){
    let headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/games/allGames', {headers: headers})
    //return this.http.get('groups/groupList', {headers: headers})
    .map(res => res.json());
  }

  storeUserData(token, user)
  {
    localStorage.setItem('id_token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  loadToken()
  {
    const token = localStorage.getItem('id_token');
    this.authToken = token;
  }

  loggedIn()
  {
  
    return tokenNotExpired("id_token");
  }

  logout()
  {
    this.authToken = null;
    this.user = null;
    localStorage.clear();
  }
  

}
