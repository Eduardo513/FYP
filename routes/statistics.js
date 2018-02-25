const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const Statistics = require('../models/statistics');
const User = require('../models/user');


//GetStats from LeagueOfLegends

router.put('/runescape', (req, res, next)=>{
    var username;
    var rsapi = require('rs-api');
    Statistics.getStatisticsById(req.body.statId, (err, statisticsObject) => {
        if (err) throw err;

        if (statisticsObject) {
            username = statisticsObject.username;
            rsapi.osrs.player.hiscores(username).then(
                function (stats) {
                    
                    Statistics.findOneAndUpdate({ _id: statisticsObject._id },
                        { $set: { runescape: stats, rank: stats.skills.overall.rank, level: stats.skills.overall.level } }, { new: true }, (err, statistic) => {
                            if (err)
                                throw err;
                            else {
                                res.json({success: true, msg: "Statistic Created Succesfully: All Data Saved" });
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

