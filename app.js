const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const app = express();

const users = require('./routes/users');
const games = require('./routes/games');


// Connect to Database
mongoose.connect(config.database);

// On Connection
mongoose.connection.on('connected', () =>{
    console.log('Connected to database' +config.database);
});

// On Connection
mongoose.connection.on('error', (err) =>{
    console.log('database error' +err);
});


//Port Number
const port = 3000;

//CORS MIDDLEWARE
app.use(cors());

//Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.use('/games', games);

//Index Route
app.get('/', (req, res) =>{
    res.send("Invalid Endpoint");
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

//Start Server
app.listen(port, () => {
    console.log('server started on port ' +port);
});



/* 
- start server = nodemon on main folder
- start database = net start Mongodb - on mongo folder as admin
- run mongo shell = mongo - in bin directory
- show dbs - shows all databases
-db.users.find(); - shows all users
- in mongo, .pretty() after things is good
- ng serve - in src folder to start angular
- git add . - adds everything to staging
- get remove - removes everything from staging area
- git status - shows whats in staging area
- git commit -m 'Commtted changes' - this commits
-git push - pushes to github
*/