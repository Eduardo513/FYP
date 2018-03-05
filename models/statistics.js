const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');





//Statistics Schema
const StatisticsSchema = mongoose.Schema({
   
    username :{
        type: String,
    },
    level :{
        type:String,
    },
    winLossRatio :{
        type:String,
    },
    gamesPlayed :{
        type:String,
    },
    averagePlayTime :{
        type:String,
    },
    rank :{
        type:String,
    },
    runescape :{
        type:{}
    },
    olschoolRunescape :{
        type:{}
    },
    overwatch :{
        type:{}
    },
    worldOfWarcraft :{
        type:{}
    },
    game :{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Game'
    },
});


const Statistics = module.exports = mongoose.model('Statistics', StatisticsSchema);

module.exports.getStatisticsById = function(id, callback){
    Statistics.findById(id, callback);
};

module.exports.getGameByStatisticsId = function(id, callback){
   
    return new Promise((resolve, reject) => {
        Statistics.findById(id, (err, stats) =>{
            if(err) return reject(err);
            return resolve(stats.game);
        });
    });
   
};

module.exports.getStatisticsByUsername = function(username, callback){
    const query = {username: username}
    Statistics.findOne(query, callback);
};

module.exports.addStatistics = function(newStatistics, callback){
    newStatistics.save(callback);
};

module.exports.requestLeagueApi = function(getRequest, input, key, callback ){
    var data;
    var request = require("request");
  
    request(getRequest + input + '?api_key=' +key, function (err, res, body) {
        if(err)
            throw err;
        data = JSON.parse(body);
        callback(null, data);
    }); 
};




