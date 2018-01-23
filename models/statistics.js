const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');





//Statistics Schema
const StatisticsSchema = mongoose.Schema({
   
    username :{
        type: String,
    },  
    //this looks like it might be an array change later
    game :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Game'
    }],
});


const Statistics = module.exports = mongoose.model('Statistics', StatisticsSchema);

module.exports.getStatisticsById = function(id, callback){
    Statistics.findById(id, callback);
}

module.exports.getStatisticsByUsername = function(username, callback){
    const query = {username: username}
    Statistics.findOne(query, callback);
}

module.exports.addStatistics = function(newStatistics, callback){
    newStatistics.save(callback);

    
}


