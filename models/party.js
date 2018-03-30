const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Party Schema
const PartySchema = mongoose.Schema({
    partyCreator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    game: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game'
    },
    title: {
        type: String
    },
    startDate: {
        type: String
    },
    displayDate:{
        type: String
    },
    public: {
        type: Boolean,

    },

});

const Party = module.exports = mongoose.model('Party', PartySchema);

module.exports.getPartyById = function (id, callback) {
    Party.findById(id, callback);
}

module.exports.getPartiesByPartyCreator = function (partyCreator, callback) {
    const query = { partyCreator: partyCreator }
    Party.find(query, callback);
}

//checks if user is the partycreator or a participant and returns the parties that the user is
module.exports.getAllPartiesForUser = function (user, callback) {
    var currentUser = user
    var allUserParties = [];
    return new Promise((resolve, reject) => {
        Party.find({}, (err, parties) => {
            if (err)
                return reject(err)
            else {
                parties.forEach(function (party, index, array) {
            
                    if (party.partyCreator == currentUser.id || party.participants.indexOf(currentUser._id) != '-1') {
                        allUserParties.push(party);
                     
                    }
                    if (index === array.length - 1) {
                        if(allUserParties.length == 0)
                        return resolve({success: false, msg: "You are not in any parties"})
                        else
                        return resolve({success:true, parties: allUserParties, msg: "All Parties you are a part of."});
                    }
                });

            }
        });


    });
}

module.exports.getPartyByStartDate = function (startDate, callback) {
    const query = { startDate: startDate }
    Party.find(query, callback);
}

module.exports.getPartyByPublic = function (public, callback) {
    const query = { public: public }
    Party.find(query, callback);
}

module.exports.addParty = function (newParty, callback) {
    newParty.save(callback);
}


