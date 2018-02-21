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

    Party.addParty(newParty, (err, party) => {
        if (err) {
            throw err;
            res.json({ success: false, msg: 'Failed to create party' });
        }
        else {
            res.json({ success: true, msg: 'Party Created' });
        }
    });
});


//AllPublicParties
router.get('/getPublicParties', (req, res, next) => {
   

    Party.getPartyByPublic(true, (err, parties) => {
        if (err)
            throw err
        if (parties.length == 0) {
            res.json({ success: false, message: 'There are no public parties.' });
        }
        else {

            return res.json({ success: true, parties: parties })
        }



    })
 });


//PartyInformationInStringFormatFromObject
//this parses all the object ids from the party object and returns it in readable string formats for display
router.post('/getPartyInString', (req, res, next) => {


    User.findById(req.body.partyCreator, (err, partyCreatorObject) => {
        if (err)
            throw err;
        if (partyCreatorObject)



            Game.findById(req.body.game, (err, gameObject) => {
                if (err)
                    throw err
                if (gameObject) {

                    const readableData = {
                        partyCreator: partyCreatorObject.username,
                        game: gameObject.name,
                        startDate: req.body.startDate,
                        numOfParticipants: req.body.participants.length

                    }
                    return res.json({ success: true, readableData: readableData })


                }

            });
    });






});


module.exports = router;
