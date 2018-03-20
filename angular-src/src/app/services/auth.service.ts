import { Injectable } from '@angular/core';
import {Http, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {tokenNotExpired} from 'angular2-jwt';
import { request } from 'https';
import { URLSearchParams } from '@angular/http/src/url_search_params';




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

  createParty(party)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/partys/create-party', party, {headers: headers})
      .map(res => res.json());
  }

  addFriend(friendData)
  {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/addFriend', friendData, {headers: headers})
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

  getLeagueOfLegends(statId){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/leagueoflegends', statId, {headers: headers})
    .map(res => res.json());
  }

  getOldschoolRunescape(statId){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/oldschoolRunescape', statId, {headers: headers})
    .map(res => res.json());
  }


  editUserProfileData(editedUser){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/users/editUserProfileData', editedUser, {headers: headers})
    .map(res => res.json());
  }

  getRunescape(statId){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/runescape', statId, {headers: headers})
    .map(res => res.json());
  }

  getWorldOfWarcraftRealms(){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/getWorldOfWarcraftRealms', {headers: headers})
    .map(res => res.json());
  }

  getWorldOfWarcraft(statId){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/worldOfWarcraft', statId, {headers: headers})
    .map(res => res.json());
  }

  addFavouriteStat(averageStatAndUser){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/users/addFavouriteStat', averageStatAndUser, {headers: headers})
    .map(res => res.json());
  }

  getUserObjectById(user){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/users/getUserObjectById', user, {headers: headers})
    .map(res => res.json());
  }

  getLogoForGame(game){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/games/getLogoForGame', game, {headers: headers})
    .map(res => res.json());
  }


  getAllAverageStatsByGame(game){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/averageStats/getAllAverageStatsByGame', game, {headers: headers})
    .map(res => res.json());
  }

  getOverwatch(statId){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/statistics/overwatch', statId, {headers: headers})
    .map(res => res.json());
  }

  getAverageStatById(averageStatId){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/AverageStats/getAverageStatById', averageStatId, {headers: headers})
    .map(res => res.json());
  }

  getSpecificUserStat(statData){
    
    let headers = new Headers();
    return this.http.put('http://localhost:3000/users/getSpecificUserStat',statData, {headers: headers})
    .map(res => res.json());
  }

  getAverageForAStat(stat){
    
    let headers = new Headers();
    return this.http.post('http://localhost:3000/statistics/getAverageForAStat', stat, {headers: headers})
    .map(res => res.json());
  }
  
  getAllGames(){
    let headers = new Headers();
    //headers.append('Content-Type', 'application/json');
    return this.http.get('http://localhost:3000/games/allGames', {headers: headers})
    //return this.http.get('groups/groupList', {headers: headers})
    .map(res => res.json());
  }

  getAllPublicParties(){
    let headers = new Headers();
    return this.http.get('http://localhost:3000/partys/getPublicParties', {headers: headers})
    .map(res => res.json());
  }

  createOrUpdateAverageStat(data){
    let headers = new Headers();
    return this.http.post('http://localhost:3000/averageStats/createOrUpdateAverageStat', data, {headers: headers})
    .map(res => res.json());
  }

  getAllStatisticsForLoggedInUser(user){
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.put('http://localhost:3000/users/getAllStatisticsForLoggedInUser', user, {headers: headers})
    .map(res => res.json());
  }

  getPartyInString(party){
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/partys/getPartyInString', party, {headers: headers})
    .map(res => res.json());
  }

  getAllFriends(user){
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/getAllFriends', user, {headers: headers})
    .map(res => res.json());
  }

  confirmFriendRequest(user){
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/confirmFriendRequest', user, {headers: headers})
    .map(res => res.json());
  }

  getAllFriendRequests(user){
    
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post('http://localhost:3000/users/getAllFriendRequests', user, {headers: headers})
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
