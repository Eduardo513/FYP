const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Statistics = require('../models/statistics');



//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });

    User.addUser(newUser, (err, user) => {
        if (err) {
            res.json({ success: false, msg: 'Failed to register user' });
        }
        else {
            res.json({ success: true, msg: 'User registered' });
        }
    });
});

//Authenticate
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if (err) {
            throw err;
        }
        if (!user) {
            return res.json({ success: false, msg: "User not found" });
        }

        User.comparePassword(password, user.password, (err, isMatch) => {
            if (err) {
                throw err;
            }
            if (isMatch) {
                const token = jwt.sign({ data: user }, config.secret, {
                    expiresIn: 604800 //1 week of seconds
                });

                res.json({
                    success: true,
                    token: 'JWT ' + token,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }
            else {
                return res.json({ success: false, msg: "Wrong Password" });
            }
        });
    });
});

//GetStatisticsFromUser
router.put('/getAllStatisticsId', (req, res, next) => {


    const user = req.body;
    var allStatistics = [];
    var j = 0;


    User.findById(user.id, (err, user) => {
        if (err)
            throw err;
        if (user) {

            if (!user.statistics) {
                res.json({ success: false, message: 'No Statistics Found.' });
            }
            else {
                for (var i = 0; i < user.statistics.length; i++) {


                    Statistics.find({
                        '_id': {
                            $in: [(user.statistics[i]) ]
                        }
                    }, function (err, docs) {
                        if (err)
                            throw err;

                        if (docs) {
                            j = j + 1

                            allStatistics.push(docs);

                            if (j == user.statistics.length) {
                                console.log(allStatistics);
                                res.json({ success: true, statistics: allStatistics });
                            }
                        }


                    })

                }


            }

        }


    });

});




//Profile
router.get('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    res.json({ user: req.user });
});


module.exports = router;
