const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const Party = require('../models/party');
const User = require('../models/user');
const Game = require('../models/game');

//CreateParty
router.post('/create-party', (req, res, next) => {


    let newParty = new Party({
        partyCreator: req.body.partyCreator.id,
        participants: req.body.partyMembers,
        game: req.body.game,
        startDate: req.body.date,
        public: req.body.accessibility
    });
    
    Party.addParty(newParty, (err, party) =>{
        if(err){
            throw err;
            res.json({success: false, msg:'Failed to create party'});
        }
        else{
            res.json({success: true, msg:'Party Created'});
        }
    });
});


module.exports = router;
