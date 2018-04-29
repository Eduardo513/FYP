const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Game = require('../models/game');

//CreateGame
router.post('/create-game', (req, res, next) => {
    let leagueGame = new Game({
        name: "Leagueoflegends",
        genre: "MOBA"
    });

    let overwatchGame = new Game({
        name: "Overwatch",
        genre: "Shooter"
    });

    let runescapeGame = new Game({
        name: "Runescape",
        genre: "MMORPG"
    });

    let oldschoolRunescapeGame = new Game({
        name: "Oldschool Runescape",
        genre: "MMORPG"
    });

    let warcraftGame = new Game({
        name: "World of Warcraft",
        genre: "MMORPG"
    });

    Game.addGame(leagueGame, (err, game) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create game' });
        }
        else {
            
    Game.addGame(overwatchGame, (err, game) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create game' });
        }
        else {
            
    Game.addGame(runescapeGame, (err, game) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create game' });
        }
        else {
            
    Game.addGame(oldschoolRunescapeGame, (err, game) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create game' });
        }
        else {
            
    Game.addGame(warcraftGame, (err, game) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to create game' });
        }
        else {
            res.json({ success: false, msg: 'Games made' });
        }
    });
        }
    });
        }
    });
        }
    });
        }
    });
});

router.put('/getLogoForGame', (req, res, next) => {
    var selectedGameId = req.body.game;
    var logo;

    Game.findById(selectedGameId, (err, gameObj)=>{

        switch (gameObj.name) {
            
                    case "Leagueoflegends":
                       logo = '/assets/images/leagueOfLegendsLogo2.png'
                        break;
            
                    case "Oldschool Runescape":
                       logo = '/assets/images/oldschoolRunescapeLogo.jpg'
                        break;
            
                    case "Runescape":
                        logo = '/assets/images/runescapeLogo.png'
                        break;
            
                    case "Overwatch":
                    logo = '/assets/images/overwatchLogo.jpg'
                        break;
            
                    case "World of Warcraft":
                    logo = '/assets/images/World-of-WarcraftLogo.png'
                        break;
            
                }
                res.json({success: true, logo: logo, msg: 'Logo Retrieved'})
            
    });
    
});



router.get('/allGames', (req, res) => {
    Game.find({}, (err, games) => {
        if (err) {
            res.json({ success: false, message: err });
        }
        else {
            if (!games) {
                res.json({ success: false, message: 'No Games found.' });
            }
            else {
                res.json({ success: true, games: games });
            }
        }
    });
});

module.exports = router;
