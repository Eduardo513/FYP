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

router.put('/getAllPartiesForUser', (req, res, next) =>{
    User.findById(req.body.id, (err, userObj) =>{
        if(userObj)
        Party.getAllPartiesForUser(userObj).then(allUserParties =>{
            if(allUserParties)
            return res.json({ success: true, allUserParties: allUserParties.parties })
            else
            return res.json({ success: false, msg: "You is not included in any parties" })
          
        });
    });

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
                        partyId: req.body._id,
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

router.put('/joinParty', (req, res, next) => {
    var loggedInUserId = req.body.loggedInUserId;
    var partyId = req.body.partyId;

    Party.getPartyById(partyId, (err, partyObject) => {
        if (err)
            throw err
        if (partyObject) {
            if (partyObject.partyCreator == loggedInUserId)
                return res.json({ success: false, msg: "You can't join a party you created" })
            else if((partyObject.participants.indexOf(loggedInUserId)) != '-1'){
                return res.json({ success: false, msg: "You are already a participant of that party" })
            }
            else {

                User.findById(loggedInUserId, (err, userObj)=>{
                    if(err)
                        throw err
                    if(userObj)
                    {
                        Party.findOneAndUpdate({ _id: partyObject._id },
                            { $push: { participants: userObj } }, (err, updatedParty) => {
                                if (err)
                                    throw err;
                                    else{
                                        return res.json({ success: true, msg: "You have joined the party" })
                                    }
                
                
                            });
                       
                    }
                });
            }
        }
    });

});


module.exports = router;
