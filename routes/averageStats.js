const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const AverageStats = require('../models/averageStat');

//CreateAverage Stats
router.post('/createOrUpdateAverageStat', (req, res, next) => {


    AverageStats.getAverageStatByName(req.body.statName)
        .then(averageStatObject => {


            if (averageStatObject == undefined) {


                let newAverageStat = new AverageStats({
                    statName: req.body.statName,
                    average: req.body.average,
                    game: req.body.game,
                    completeLocation: req.body.completeLocation
                });

                AverageStats.addAverageStat(newAverageStat, (err, averageStat) => {
                    if (err)
                        res.json({ success: false, msg: 'AverageStat failed to create' });

                    else
                        res.json({ success: true, averageStat: averageStatObject, msg: 'AverageStat Created' });
                })


            }
            else {

                if (averageStatObject.game == req.body.game._id)//error checking to see if so the same stat name for different games dont get created
                {

                    AverageStats.findByIdAndUpdate({ _id: averageStatObject._id },
                        { $set: { average: req.body.average } }, (err, averageStat) => {
                            if (err)
                                console.log(err);
                            else {
                                res.json({ success: true, averageStat: averageStatObject, msg: 'AverageStat Updated' });
                            }
                        }

                    );
                }
                else
                    res.json({ success: false, msg: 'Wrong game for the stat' });
            }


        });



});

router.put('/getAverageStatById', (req, res, next) => {
    AverageStats.findById(req.body.favouriteStatId, (err, averageStatObject) => {
        if(err)
        throw err;
        if(averageStatObject)
        {
            res.json({ success: true, averageStatObject: averageStatObject, msg: 'Average Stat Object retrieved' });
        }

    });
});


router.put('/getAllAverageStatsByGame', (req, res, next) => {

    Game.getGameByName(req.body.game)
        .then(gameObj => {

            AverageStats.getAverageStatsByGame(gameObj)
                .then(allStatsForGame => {
                    res.json({ success: true, averageStatsForGame: allStatsForGame, msg: 'Average Stats for game retrieved' });

                }).catch(console.error);
        }).catch(console.error);
});


module.exports = router;
