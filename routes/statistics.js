

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
            console.log(reason);
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
    console.log(req.body.username);
    console.log(req.body.realm);
    console.log(req.body.region);
    blizzard.wow.character(['profile', 'guild', 'mounts', 'pvp', 'stats'], { origin: req.body.region, realm: req.body.realm, name: req.body.username })
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
            console.log(reason);
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

// router.put('/leagueoflegends', (req, res, next) => {
//     var realStatId = req.body.statId;
//     var wins;
//     var losses;
//     var averagePlayTime;
//     var summonerLevel;
//     var apiKey = 'RGAPI-665248d5-688d-41c0-ba6f-9eab34b14d1b';
//     Statistics.getStatisticsById(realStatId, (err, statisticsObject) => {
//         if (err) throw err;

//         if (statisticsObject) {

//             Statistics.requestLeagueApi("https://euw1.api.riotgames.com/lol/summoner/v3/summoners/by-name/", statisticsObject.username, apiKey, (err, data) => {
//                 if (err)
//                     throw err;

//                 if (data) {
//                     if ("status" in data) {
//                         console.log("Error: " + data.status.status_code);
//                         res.json({ success: false, msg: "Something Went Wrong" });
//                     }
//                     else {
//                         //grabs level off the data to update later
//                         summonerLevel = data.summonerLevel;

//                         Statistics.requestLeagueApi('https://euw1.api.riotgames.com/lol/match/v3/matchlists/by-account/', data.accountId, apiKey, (err, data) => {
//                             if (err)
//                                 throw err;

//                             if (data) {
//                                 if ("status" in data) {
//                                     console.log("Error: " + data.status.status_code);
//                                     res.json({ success: false, msg: "Something Went Wrong" });
//                                 }
//                                 else {
//                                    
//                                     //average time per game of league is 30 mins
//                                     averagePlayTime = (data.totalGames * 30) / 60;
//                                     //updates stat object and sets data
//                                     Statistics.findOneAndUpdate({ _id: statisticsObject._id },
//                                         { $set: { gamesPlayed: data.totalGames, averagePlayTime: averagePlayTime, level: summonerLevel } }, { new: true }, (err, statistic) => {
//                                             if (err)
//                                                 throw err;
//                                             else {
//                                                 res.json({ success: true, msg: "Statistic Created Succesfully: All Data Saved" });
//                                                 console.log(statistic)


//                                             }
//                                         });


//                                 }
//                             }
//                         });





//                     }
//                 }
//             });
//         }
//     });



// });

//CreateStatistic
router.post('/create-statistics', (req, res, next) => {

    var j = 0;
    var statisticsExists = false; // boolean used to check if statistics object was already created for that user for that game.
    const name = req.body.detailedStats.game;
    const currentUserId = req.body.detailedStats.userId;
    var emptyStats = false;

    //validation to see if statistics is already created with that game for that user
    //get game object by name
    Game.getGameByName(name)
        .then(gameObj => {
            //retrieves all the statistics for the user
            User.getAllStatisticsByUserId(currentUserId)
                .then(stats => {
                    if (stats.length == 0)//if not stats are created then create stats
                        saveStatistics(gameObj);
                    else {

                        for (var i = 0; i < stats.length; i++) {

                            Statistics.getGameByStatisticsId(stats[i]).then(game => {
                                j = j + 1;
                                if (game == gameObj.id) {
                                    statisticsExists = true;

                                    res.json({ success: false, msg: 'You have already created Statistics for that game.' });

                                }
                                //if all the stats have been looked at and none of them equal the one the user is trying to create then create stats
                                if (!statisticsExists && j == stats.length)
                                    saveStatistics(gameObj)
                            });


                        }

                    }
                })



        });



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

