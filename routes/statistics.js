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
    var data = {};
    var accountId;
    var matches = [];
    var matchId;
    var username = req.body.username;
    var allMatchTime = 0;
    var request = require("request");


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


        Statistics.addStatistics(newStatistics, (err, statistc) => {

            if (err) {
                res.json({ success: false, msg: 'Failed to create statistc' });
            }
            else {
                res.json({ success: true, msg: 'Statistic Created' });
            }

        });

        //add statistics object to user object
        User.findOneAndUpdate({ _id: currentUserId },
            { $push: { statistics: newStatistics } }, (err, statistic) => {
                if (err)
                    console.log(err);

            })


    });

});

module.exports = router;


