const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');
const Statistics = require('../models/statistics');

//CreateStatistic
router.post('/create-statistics', (req, res, next) => {
   
    const name = req.body.game;
    Game.getGameByName(name, (err, gameObj) => {

        if(err)
        {
        throw err;
        } 
            if (!gameObj)
            {
                return res.json({success: false, msg: 'Game not found:'})
            }

            let newStatistics = new Statistics
            ({
                username: req.body.username,
                game: gameObj
            });
    
   

     Statistics.addStatistics(newStatistics, (err, statistc) =>{
         
          if(err){
              res.json({success: false, msg:'Failed to create statistc'});
          }
          else{
             res.json({success: true, msg:'Statistic Created'});
          }
          
        });

    });
    
});

module.exports = router;


