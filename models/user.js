const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//User Schema
const UserSchema = mongoose.Schema({
    name :{
        type: String
    },
    email :{
        type: String,
        required: true
    },
    username :{
        type: String,
        required: true
    },
    password :{
        type: String,
        required: true
    },
    profilePicture :{
        type: String,
    },
    bio :{
        type: String,
    },
    favouriteGame :{
        type: String,
    },
    gamingSince :{
        type: Date,
    },
    statistics :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Statistics'
    }],
    friendRequests :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    friends :[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    favouriteStats :[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'AverageStat'
    }]
});

const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getAllFavouriteStats = function(id, callback){
    return new Promise((resolve, reject) => {
        User.findById(id, (err, user) =>{
            if(err) return reject(err);
            return resolve(user.favouriteStats);
        });
    });
}

module.exports.getAllStatisticsIdsByUserId = function(id, callback){
    return new Promise((resolve, reject) => {
        User.findById(id, (err, user) =>{
            if(err) return reject(err);
            return resolve(user.statistics);
        });
    });

}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) =>{
            if(err) throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.comparePassword = function(candidatePassword, hash, callback) {
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}



