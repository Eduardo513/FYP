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
        public: req.body.accessibility,
        title: req.body.title,
        displayDate: req.body.displayDate
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
//we are getting all public parties that do not include the user as there is a nother method that gets all parties that the user is included in already
//this is so we can see all the parties available that the user can join
router.put('/getPublicPartiesWithoutUser', (req, res, next) => {
    var allValidParties = [];
    var currentUserId = req.body.id;
    Party.getPartyByPublic(true, (err, parties) => {
        if (err)
            throw err
        if (parties.length == 0) {
            res.json({ success: false, message: 'There are no public parties.' });
        }
        else {
            parties.forEach(function (party, index, array) {
                if (party.partyCreator != currentUserId && party.participants.indexOf(currentUserId) == '-1') {
                    allValidParties.push(party);
                }
                if (index === array.length - 1) {
                    if (allValidParties.length == 0)
                        return res.json({ success: false, msg: "There are no public Parties you are not a part of" })
                    else
                        return res.json({ success: true, parties: allValidParties, msg: "All public parties you are not a part of." });
                }
            });

        }



    })
});

router.put('/getAllPartiesForUser', (req, res, next) => {
    User.findById(req.body.id, (err, userObj) => {
        if (userObj)
            Party.getAllPartiesForUser(userObj).then(allUserParties => {
                if (allUserParties.success)
                    return res.json({ success: true, allUserParties: allUserParties.parties })
                else
                    return res.json({ success: false, msg: "You is not included in any parties" })

            });
    });

});


//PartyInformationInStringFormatFromObject
//this parses all the object ids from the party object and returns it in readable string formats for display
router.post('/getPartyInString', (req, res, next) => {
    var allParticipants = req.body.participants;
    var allParticipantObjects = [];
//checks to see if there are any particpants, if there is grabs the object data for each one and adds it to array, otherwise just return empty array
    if (allParticipants.length != 0) {
        allParticipants.forEach(function (participant, index, array) {
            User.findById(participant, (err, participantObject) => {
                if (participantObject)
                    allParticipantObjects.push(participantObject)

                if (index === array.length - 1)
                    convertPartyToString(req.body, allParticipantObjects)

            });
        });
    }
    else{
        convertPartyToString(req.body, req.body.participants)
    }

    function convertPartyToString(bodyData, participants) {
        User.findById(bodyData.partyCreator, (err, partyCreatorObject) => {
            if (err)
                throw err;
            if (partyCreatorObject) {
                Game.findById(bodyData.game, (err, gameObject) => {
                    if (err)
                        throw err
                    if (gameObject) {
                        const readableData = {
                            partyId: bodyData._id,
                            partyCreator: partyCreatorObject.username,
                            game: gameObject.name,
                            startDate: bodyData.startDate,
                            participants: participants,
                            title: bodyData.title,
                            public: bodyData.public,
                            displayDate: bodyData.displayDate


                        }
                        return res.json({ success: true, readableData: readableData })


                    }

                });
            }
        });
    }
});


router.put('/submitEditParty', (req, res, next) => {
    
        Party.findOneAndUpdate({ _id: req.body.id },
            {
                $set: {
                   title: req.body.title,
                   startDate: req.body.date,
                    game: req.body.game,
                    public: req.body.public,
                    displayDate : req.body.displayDate
                }
            }, (err, editedParty) => {
                if (editedParty)
                    res.json({ success: true, editedParty: editedParty, msg: 'Party updated' });
                else {
                    res.json({ success: false, err: err, msg: 'Failed to update party' });
                }
            }
    
        );
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
            else if ((partyObject.participants.indexOf(loggedInUserId)) != '-1') {
                return res.json({ success: false, msg: "You are already a participant of that party" })
            }
            else {

                User.findById(loggedInUserId, (err, userObj) => {
                    if (err)
                        throw err
                    if (userObj) {
                        Party.findOneAndUpdate({ _id: partyObject._id },
                            { $push: { participants: userObj } }, (err, updatedParty) => {
                                if (err)
                                    throw err;
                                else {
                                    return res.json({ success: true, msg: "You have joined the party" })
                                }


                            });

                    }
                });
            }
        }
    });

});

router.put('/leaveParty', (req, res, next) => {
    var loggedInUserId = req.body.loggedInUserId;
    var partyId = req.body.partyId;

    Party.getPartyById(partyId, (err, partyObject) => {
        if (err)
            throw err
        if (partyObject) {
            if ((partyObject.participants.indexOf(loggedInUserId)) == '-1') {
                return res.json({ success: false, msg: "You are not in that party" })
            }
            else {
                Party.findOneAndUpdate({ _id: partyObject._id },
                    { $pull: { participants: loggedInUserId } }, (err, updatedParty) => {
                        if (err)
                            throw err;
                        else {
                            return res.json({ success: true, msg: "You have left the party" })
                        }
                    });
            }
        }
    });

});

router.put('/deleteParty', (req, res, next) => {
    var partyId = req.body.partyId;
    Party.findOneAndRemove({ _id: partyId }, (err, deletedParty) => {
        if (deletedParty) {
            return res.json({ success: true, msg: "Party Deleted" })
        }
        else {
            return res.json({ success: false, msg: "Unable to delete party" })
        }
    });


});


module.exports = router;
