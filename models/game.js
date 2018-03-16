const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/database');

//Game Schema
const GameSchema = mongoose.Schema({
    name :{
        type: String
    },
    genre :{
        type: String,
    },  
});

const Game = module.exports = mongoose.model('Game', GameSchema);

module.exports.getGameById = function(id, callback){
    Game.findById(id, callback);
}

module.exports.getGameByName = function(name, callback){
    return new Promise((resolve, reject) =>{
        const query = {name: name}
        Game.findOne(query, (err, game) =>{
            if(err) return reject(err);
            return resolve(game);
        });
    });
    
}

module.exports.getAllGames = function(callback){
    return new Promise((resolve, reject) =>{
        const query = {}
        Game.find(query, (err, games) =>{
            if(err) return reject(err);
            return resolve(games);
        });
    });
    
}

module.exports.getGameByGenre = function(genre, callback){
    const query = {genre: genre}
    Game.findOne(query, callback);
}

module.exports.addGame = function(newGame, callback){
    newGame.save(callback);
}


