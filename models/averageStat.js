const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Game Schema
const AverageStatSchema = mongoose.Schema({
    statName :{
        type: String,
        unique: true
    },
    average :{
        type: Number,
    },
    game :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Game'
    },  
    completeLocation :{
        type: String,
    },
});

const AverageStat = module.exports = mongoose.model('AverageStat', AverageStatSchema);

module.exports.getAverageStatById = function(id, callback){
    AverageStat.findById(id, callback);
}

module.exports.getAverageStatByName = function(name, callback){
    return new Promise((resolve, reject) =>{
        const query = {statName: name}
        AverageStat.findOne(query, (err, averageStat) =>{
            if(err) return reject(err);
            return resolve(averageStat);
        });
    });
    
}

module.exports.getAverageStatsByGame = function(game, callback){
    return new Promise((resolve, reject) =>{
        const query = {game: game}
        AverageStat.find(query, (err, averageStats) =>{
            if(err)
            return reject(err);
            else
            return resolve(averageStats);
        });
    });
}

module.exports.addAverageStat = function(newAverageStat, callback){
    newAverageStat.save(callback);
}


