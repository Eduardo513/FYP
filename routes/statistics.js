

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const Statistics = require('../models/statistics');
const User = require('../models/user');


//GetStats from LeagueOfLegends

router.put('/overwatch', (req, res, next) =>{
    var username = req.body.username;
    var timePlayed;
    var owjs = require('overwatch-js');

    Statistics.getStatisticsById(req.body.statId, (err, statisticsObject) => {
        if (err) throw err;
        if(statisticsObject){
            owjs.getOverall('pc', 'eu', statisticsObject.username)
            .then((overwatchStats) => 
             timePlayed = 
                Statistics.findOneAndUpdate({ _id: statisticsObject._id },              //time needs to be divided by this to be accurate         //level is the tier times 100 plus what the level from the api is
                { $set: { overwatch: overwatchStats, averagePlayTime: (((overwatchStats.quickplay.global.time_played / 60)/60)/1000), level: (((overwatchStats.profile.tier)*100) + overwatchStats.profile.level) } }, { new: true }, (err, statistic) => {
                    if (err)
                        throw err;
                    else {
                        res.json({ success: true, msg: "Statistic Created Succesfully: All Data Saved" });
                    }
                }));
            // .then((data) => console.dir(data, {depth : 2, colors : true}) );
        }
    });
   //// Search for a player ( you must have the exact username, if not Blizzard api will return a not found status)
   
});

router.put('/runescape', (req, res, next) => {
    var username;
    var rsapi = require('rs-api');
    Statistics.getStatisticsById(req.body.statId, (err, statisticsObject) => {
        if (err) throw err;

        if (statisticsObject) {
            username = statisticsObject.username;
            rsapi.osrs.player.hiscores(username).then(
                function (runescapeStats) {

                    Statistics.findOneAndUpdate({ _id: statisticsObject._id },
                        { $set: { runescape: runescapeStats, rank: runescapeStats.skills.overall.rank, level: runescapeStats.skills.overall.level } }, { new: true }, (err, statistic) => {
                            if (err)
                                throw err;
                            else {
                                res.json({ success: true, msg: "Statistic Created Succesfully: All Data Saved" });
                            }
                        });

                }).catch(console.error);

        }


    });
});
router.put('/leagueoflegends', (req, res, next) => {
    var realStatId = req.body.statId;
    var wins;
    var losses;
    var averagePlayTime;
    var summonerLevel;
    var apiKey = 'RGAPI-92405013-dd45-47df-b763-113b979d68eb';
    Statistics.getStatisticsById(realStatId, (err, statisticsObject) => {
        if (err) throw err;

        if (statisticsObject) {

            Statistics.requestLeagueApi("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/", statisticsObject.username, apiKey, (err, data) => {
                if (err)
                    throw err;

                if (data) {
                    if ("status" in data) {
                        console.log("Error: " + data.status.status_code);
                        res.json({ success: false, msg: "Something Went Wrong" });
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
                                    res.json({ success: false, msg: "Something Went Wrong" });
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
                                                res.json({ success: true, msg: "Statistic Created Succesfully: All Data Saved" });
                                                console.log(statistic)


                                            }
                                        });


                                }
                            }
                        });





                    }
                }
            });
        }
    });



});
//CreateStatistic
router.post('/create-statistics', (req, res, next) => {

    var j = 0;
    var statisticsExists = false; // boolean used to check if statistics object was already created for that user for that game.
    const name = req.body.game;
    const currentUserId = req.body.id;
    var emptyStats = false;



    //validation to see if statistics is already created with that game for that user
    //get game object by name
    Game.getGameByName(name)
        .then(gameObj => {
               
            //retrieves all the statistics for the user
            User.getAllStatisticsByUserId(currentUserId)
                .then(stats => {
              if(stats.length == 0)//if not stats are created then create stats
              saveStatistics(gameObj);
              else{

              


                    for (var i = 0; i < stats.length; i++) {
                        
                        Statistics.getGameByStatisticsId(stats[i]).then(game => {
                           j = j + 1;
                           if(game == gameObj.id)
                           {
                               statisticsExists = true;
                               
                               res.json({ success: false, msg: 'You have already created Statistics for that game.' });
                               
                           }
                           //if all the stats have been looked at and none of them equal the one the user is trying to create then create stats
                           if(!statisticsExists && j == stats.length)
                             saveStatistics(gameObj)
                        });

                     
                    }
                    
                }
                })
               
            

        });

       

    function saveStatistics(gameObj) {
        
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


            }

        );

    }


});



module.exports = router;

