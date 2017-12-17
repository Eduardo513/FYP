const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');

//CreateGame
router.post('/create-game', (req, res, next) => {
    let newGame = new Game({
        name: req.body.name,
        genre: req.body.genre
    });

    Game.addGame(newGame, (err, game) =>{
        if(err){
            res.json({success: false, msg:'Failed to create game'});
        }
        else{
            res.json({success: true, msg:'Game created'});
        }
    });
});

router.get('/allGames', (req, res) => 
{
    Game.find({}, (err, games) =>
    {
        if(err){
            res.json({ success: false, message: err });
        }
        else
        {
            if(!games)
            {
                res.json({ success: false, message: 'No Games found.' });
            }
            else
            {
                res.json({ success: true, games: games });
            }
        }
    });
});

module.exports = router;
