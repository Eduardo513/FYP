const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Party Schema
const PartySchema = mongoose.Schema({
    partyCreator :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    participants :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    game :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Game'
    },
    startDate :{
        type: Date
    },
    public :{
        type: Boolean,
        required: true
    },

});

const Party = module.exports = mongoose.model('Party', PartySchema);

module.exports.getPartyById = function(id, callback){
    Party.findById(id, callback);
}

module.exports.getPartyByPartyCreator = function(partyCreator, callback){
    const query = {partyCreator: partyCreator}
    Party.findOne(query, callback);
}

module.exports.getPartyByStartDate = function(startDate, callback){
    const query = {startDate: startDate}
    Party.find(query, callback);
}

module.exports.addParty = function(newParty, callback){
    newParty.save(callback);
}


