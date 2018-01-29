const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const Statistics = require('../models/statistics');
const User = require('../models/user');


//GetStats from LeagueOfLegends

router.put('/leagueoflegends', (req, res, next) => {
    var realStatId = req.body.statId;
    var wins;
    var losses;
    var averagePlayTime;
    var summonerLevel;
    var apiKey = 'RGAPI-faa71b5e-5aed-409e-ac73-0d3f92511489';
    Statistics.getStatisticsById(realStatId, (err, statisticsObject) => {
        if (err) throw err;

        if (statisticsObject) {

            Statistics.requestLeagueApi("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/", statisticsObject.username, apiKey, (err, data) => {
                if (err)
                    throw err;

                if (data) {
                    if ("status" in data) {
                        console.log("Error: " + data.status.status_code);
                        res.json({success: false, msg: "Something Went Wrong" });
                    }
                    else {
                        //grabs level off the data to update later
                        summonerLevel = data.summonerLevel;

                        Statistics.requestLeagueApi('https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/', data.accountId, apiKey, (err, data) => {
                            if (err)
                                throw err;

                            if (data) {
                                if ("status" in data) {
                                    console.log("Error: " + data.status.status_code);
                                    res.json({success: false, msg: "Something Went Wrong" });
                                }
                                else {
                                    //average time per game of league is 30 mins
                                    averagePlayTime = (data.totalGames * 30) / 60;
                                    //updates stat object and sets data
                                    Statistics.findOneAndUpdate({ _id: statisticsObject._id },
                                        { $set: { gamesPlayed: data.totalGames, averagePlayTime: averagePlayTime, level: summonerLevel } }, { new: true }, (err, statistic) => {
                                            if (err)
                                                throw err;
                                            else {
                                                res.json({success: true, msg: "Statistic Created Succesfully: All Data Saved" });
                                                console.log(statistic)
                                               

                                            }
                                        });

                                    /*   //      This is attempting to get the win loss ratio for the particapnts but its very difficult, come back later
                                    for (var i = 0; i < 1; i++) {

                                        Statistics.requestLeagueApi('https://euw1.api.riotgames.com/lol/match/v3/matches/', data.matches[i].gameId, apiKey, (err, data) => {
                                            if(err)
                                                throw err;

                                            if(data){
                                                if ("status" in data) {
                                                    console.log("Error: " + data.status.status_code);
                                                }
                                                else{
                                                    for (var i = 0; i < 10; i++) {
                                                      
                                                        // console.log(data.participantIdentities[i].player.summonerName);
                                                        // if(data.participantIdentities[i].player.summonerName == "Mr Garnz")
                                                        // {
                                                        //     console.log(data.participantIdentities[i].participantId);
                                                          
                                                        //     if(data.participantIdentities[i].participantId <= 5 )
                                                        //      console.log(data.teams[0].win);
                                                        //     else{
                                                        //         console.log(data.teams[1].win);
                                                        //     }
                                                        //      //console.log(data.participantIdentities[i].player.summonerName)
                                                        //  }
                                                         
                                                    }
                                                
                                                }
                                            }
                                        });
                                 
                                    }
                                    */
                                }
                            }
                        });





                    }
                }
            });
        }
    });


    /*

    request('https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/' + username + '?api_key=RGAPI-76b3eca2-9f6f-4c05-a5b2-775458d33f92', function (err, res, body) {
       
        var summonerObj = JSON.parse(body);
        console.log(summonerObj);
      


            accountId = summonerObj.accountId;

            request('https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/' + accountId + '/?api_key=RGAPI-76b3eca2-9f6f-4c05-a5b2-775458d33f92', function (err, res, body) {
                matches = JSON.parse(body);
                console.log(matches);
                
              
                    
                    console.log(matches.matches.length);

                    for (var i = 0; i < matches.matches.length; i++) {
                        var match = matches.matches[i];
                        console.log(match);

                        request('https://euw1.api.riotgames.com/lol/match/v3/matches/' + matches.matches[i].gameId + '/?api_key=RGAPI-76b3eca2-9f6f-4c05-a5b2-775458d33f92', function (err, res, body) {
                            var matcheInfo = JSON.parse(body);

                            if (matcheInfo.gameDuration != null) {
                                allMatchTime = allMatchTime + matcheInfo.gameDuration;
                                console.log(allMatchTime);
                            
                            }

                            //console.log(matcheInfo.gameDuration);
                            //console.log(matches);
                            // for (var i=0;i<100;i++) {
                            //var match = matches.matches[i];
                            //  console.log(match);
                            // }
                        });
                    }
                   
                
            });

        
    });
*/
});
//CreateStatistic
router.post('/create-statistics', (req, res, next) => {

    const name = req.body.game;
    const currentUserId = req.body.id;

    //add validation here to check if game already exists for logged in user

    Game.getGameByName(name, (err, gameObj) => {

        if (err) {
            throw err;
        }
        if (!gameObj) {
            return res.json({ success: false, msg: 'Game not found:' })
        }

        let newStatistics = new Statistics
            ({
                username: req.body.username,
                game: gameObj,

            });


        Statistics.addStatistics(newStatistics, (err, statistic) => {

            if (err) {
                res.json({ success: false, msg: 'Failed to create statistc' });
            }
            else {
                res.json({ success: true, statId: statistic._id, msg: 'Statistic Created' });
            }

        });

        //add statistics object to user object
        User.findOneAndUpdate({ _id: currentUserId },
            { $push: { statistics: newStatistics } }, (err, statistic) => {
                if (err)
                    throw err;


            });


    });

});

module.exports = router;


