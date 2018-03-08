

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const Statistics = require('../models/statistics');
const User = require('../models/user');
const rsapi = require('rs-api');
const BLIZZARD_API_KEY = 'jutgaaa5v98ykzwe7wrpemseg6rqy6zb';
const blizzard = require('blizzard.js').initialize({ apikey: BLIZZARD_API_KEY });
const owjs = require('overwatch-js');
//GetStats from LeagueOfLegends

router.put('/overwatch', (req, res, next) => {

    owjs.getOverall(req.body.platform, req.body.region, req.body.username)
        .then((overwatchStats) => {

            const detailedStats = {
                username: req.body.username,
                game: req.body.game,
                userId: req.body.id,
                detailGameData: overwatchStats,
                averagePlayTime: (((overwatchStats.quickplay.global.time_played / 60) / 60) / 1000),
                level: (((overwatchStats.profile.tier) * 100) + overwatchStats.profile.level)
            }
            res.json({ success: true, detailedStats: detailedStats, msg: "User data found, creating statistic..." });
        }).catch(reason => {
            res.json({ success: false, msg: "Username not found in Overwatch database, Please try again." });
        });

});


router.put('/runescape', (req, res, next) => {

    rsapi.rs.player.hiscores(req.body.username).then(
        function (runescapeStats) {

            const detailedStats = {
                username: req.body.username,
                game: req.body.game,
                userId: req.body.id,
                detailGameData: runescapeStats,
                rank: runescapeStats.skills.overall.rank,
                level: runescapeStats.skills.overall.level
            }
            res.json({ success: true, detailedStats: detailedStats, msg: "User data found, creating statistic..." });



        }).catch(reason => {
            res.json({ success: false, msg: "Username not found in Runescape database, Please try again." });
        });



});

router.put('/oldschoolRunescape', (req, res, next) => {


    rsapi.osrs.player.hiscores(req.body.username).then(
        function (runescapeStats) {

            const detailedStats = {
                username: req.body.username,
                game: req.body.game,
                userId: req.body.id,
                detailGameData: runescapeStats,
                rank: runescapeStats.skills.overall.rank,
                level: runescapeStats.skills.overall.level
            }
            res.json({ success: true, detailedStats: detailedStats, msg: "User data found, creating statistic..." });



        }).catch(reason => {
            res.json({ success: false, msg: "Username not found in Oldschool Runescape database, Please try again." });
        });



});




router.put('/worldOfWarcraft', (req, res, next) => {

    blizzard.wow.character(['profile', 'guild', 'pvp', 'stats'], { origin: req.body.region, realm: req.body.realm, name: req.body.username })
        .then(wowData => {
            const detailedStats = {
                username: req.body.username,
                game: req.body.game,
                userId: req.body.id,
                detailGameData: wowData.data,
                level: wowData.data.level
            }
            res.json({ success: true, detailedStats: detailedStats, msg: "User data found, creating statistic..." });



        }).catch(reason => {

            res.json({ success: false, msg: "Username not found in World of Warcraft database, Please try again." });
        });

});






//gets all the realms for each server accros korea/usa/eurpe and tw
router.put('/getWorldOfWarcraftRealms', (req, res, next) => {
    var allRealms = [];

    blizzard.wow.realms({ origin: 'kr' })
        .then(response => {
            response.data.realms.forEach(function (entry) {
                allRealms.push(entry.name);
            });
            blizzard.wow.realms({ origin: 'us' })
                .then(response => {
                    response.data.realms.forEach(function (entry) {
                        allRealms.push(entry.name);
                    });
                    blizzard.wow.realms({ origin: 'eu' })
                        .then(response => {
                            response.data.realms.forEach(function (entry) {
                                allRealms.push(entry.name);
                            });
                            blizzard.wow.realms({ origin: 'tw' })
                                .then(response => {
                                    response.data.realms.forEach(function (entry) {
                                        allRealms.push(entry.name);
                                    });
                                    var uniqueRealms = [...new Set(allRealms)]; //this removes duplicat realms as eu and us have a lot of same name realms
                                    uniqueRealms.sort(); //sorts in alphebetical order
                                    res.json({ success: true, realms: uniqueRealms })
                                });

                        });

                });

        });

});
router.put('/leagueoflegends', (req, res, next) => {
    var summonerLevel;
    var summonerProfile;
    var apiKey = 'RGAPI-665248d5-688d-41c0-ba6f-9eab34b14d1b';


    Statistics.requestLeagueApi("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/", req.body.username, apiKey, (err, data) => {
        if (err)
            throw err;

        if (data) {
            if ("status" in data) {
                console.log("Error: " + data.status.status_code);
                res.json({ success: false, msg: "Username not found in League of Legends database, Please try again." });
            }
            else {
                //grabs level off the data to update later
                summonerLevel = data.summonerLevel;
                summonerProfile = data;

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


                            const detailedStats = {
                                username: req.body.username,
                                game: req.body.game,
                                userId: req.body.id,
                                detailGameData: summonerProfile,
                                level: summonerLevel
                            }
                            res.json({ success: true, detailedStats: detailedStats, msg: "User data found, creating statistic..." });

                        }
                    }
                });





            }
        }
    });

});


router.post('/getAverageForAStat', (req, res, next) => {

    const statLocationTier1 = req.body.statLocationTier1;
    const statLocationTier2 = req.body.statLocationTier2;
    const statLocationTier3 = req.body.statLocationTier3;
    const statLocationTier4 = req.body.statLocationTier4;
    const statLocationTier5 = req.body.statLocationTier5;
    var averageStat = 0;
    Game.getGameByName(req.body.game)
        .then(gameObj => {

            Statistics.getAllStatisticsForGame(gameObj)
                .then(stats => {
                  
                    for (var i = 0; i < stats.length; i++) {
                        if (statLocationTier2 == undefined) {
                            averageStat = averageStat + parseInt(stats[i][statLocationTier1]);
                        }
                        else if (statLocationTier3 == undefined) {
                            averageStat = averageStat + parseInt(stats[i][statLocationTier1][statLocationTier2]);
                        }
                        else if (statLocationTier4 == undefined) {
                            averageStat = averageStat + parseInt(stats[i][statLocationTier1][statLocationTier2][statLocationTier3]);
                        }
                        else if (statLocationTier5 == undefined) {
                            averageStat = averageStat + parseInt(stats[i][statLocationTier1][statLocationTier2][statLocationTier3][statLocationTier4]);
                        }
                        else {
                            averageStat = averageStat + parseInt(stats[i][statLocationTier1][statLocationTier2][statLocationTier3][statLocationTier4][statLocationTier5]);
                        }


                    }

                    averageStat = averageStat / stats.length;
                    Math.round(averageStat);
                    if (averageStat.isNullOrUndefined) {
                        res.json({ success: false, msg: 'Failed to retrieve Average' });
                    }
                    else {
                        res.json({ success: true, averageStat: averageStat, msg: 'Average Retrieved' });
                    }

                }).catch(reason => {
                    res.json({ success: false, msg: "Username not found in Oldschool Runescape database, Please try again." });
                });

        }).catch(console.error);


});

/*Quite complicated code before so will explain. This code is only executed once the gamedetails have been retrived and confirmed that they exist
we then find the game object via the game name and then grab all the statistics for the user. We first check if the user has any statistics. If none
then we just create it. We then check if the user has a statistic related to the game, if the user does then we run updateStatistics() with a paramter
of the statistic id that we found to be related to the game. if the user does not have a statistc related to this game then we go ahead and create it
which we are in context of. if the 
*/
//CreateStatistic
router.post('/create-statistics', (req, res, next) => {

    var j = 0;
    var statisticNumber = 0;
    var statisticsExists = false; // boolean used to check if statistics object was already created for that user for that game.
    const name = req.body.detailedStats.game;
    const currentUserId = req.body.detailedStats.userId;
    var emptyStats = false;

    //validation to see if statistics is already created with that game for that user
    //get game object by name
    Game.getGameByName(name)
        .then(gameObj => {
            //retrieves all the statistics for the user
            User.getAllStatisticsIdsByUserId(currentUserId)
                .then(stats => {
                    if (stats.length == 0)//if not stats are created then create stats
                        saveStatistics(gameObj);
                    else {

                        for (var i = 0; i < stats.length || statisticsExists; i++) {
                            Statistics.getGameByStatisticsId(stats[i])
                            .then(game => {
                                j = j + 1;
                               
                                if (game == gameObj.id) {
                                    statisticsExists = true;
                                    updateStatistics(stats[j-1], gameObj);
                                       //this is giving an error when creating  stats cant set headers after they are sent
                                    
                                 
                                }
                                //if all the stats have been looked at and none of them equal the one the user is trying to create then create stats
                                if (!statisticsExists && j == stats.length)
                                    saveStatistics(gameObj)
                                   
                            });
                            

                        }

                    }
                })



        });

        function updateStatistics(statObject, gameObj){

         Statistics.findOneAndUpdate({ _id: statObject },
            {
                $set: {
                    username: req.body.detailedStats.username,
                    game: gameObj,
                    detailGameData: req.body.detailedStats.detailGameData,
                    level: req.body.detailedStats.level,
                    rank: req.body.detailedStats.rank
                }
            }, (err, newStatistic) => {
                if (err)
                     res.json({ success: false, err: err, msg: 'Failed to update statistc' });
                else {
                    res.json({ success: true, newStatistic: newStatistic, msg: 'Statistic Updated' });
                }
            }

        );
    }

    function saveStatistics(gameObj) {

        let newStatistics = new Statistics({
            username: req.body.detailedStats.username,
            game: gameObj,
            detailGameData: req.body.detailedStats.detailGameData,
            level: req.body.detailedStats.level,
            rank: req.body.detailedStats.rank
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

