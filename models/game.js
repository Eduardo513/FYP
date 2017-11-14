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

module.exports.getGameByGenre = function(genre, callback){
    const query = {genre: genre}
    Game.findOne(query, callback);
}

module.exports.addGame = function(newGame, callback){
    newGame.save(callback);
}


