const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const AverageStats = require('../models/averageStat');

//CreateGame
router.post('/createOrUpdateAverageStat', (req, res, next) => {

    Game.getGameByName(req.body.game)
    .then(gameObj =>{
        AverageStats.getAverageStatByName(req.body.statName)
        .then(averageStatObject =>{

            if(averageStatObject == undefined){
                
           
                let newAverageStat = new AverageStats({
                    statName: req.body.statName,
                    average: req.body.average,
                    game: gameObj});

                AverageStats.addAverageStat(newAverageStat, (err, averageStat) =>{
                    if(err)
                        res.json({ success: false, msg: 'AverageStat failed to create' });
            
                    else
                    res.json({ success: true, averageStat: averageStatObject, msg: 'AverageStat Created' });
                })
            
                            
            }
            else{
                if(averageStatObject.game == gameObj.id)//error checking to see if so the same stat name for different games dont get created
                {
                AverageStats.findByIdAndUpdate({_id: averageStatObject._id},
                     {$set:{ average: req.body.average } }, (err, averageStat) =>{
                         if(err)
                            console.log(err);
                            else{
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
    
});



module.exports = router;
