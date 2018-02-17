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

//addFriendToUser
//the person who initiated the request sends a friendrequest. this will add their own user object to the friends friendrequest array
//the friend will then have to accept the friend request and only then will both friend arrays on both user objects be updated with each other
//So until the user who recieves the request confirms it, the user who sent the request will have no data saved on his profile, only the friend will have a friendRequest saved.
//router
router.post('/addFriend', (req, res, next) => {
    const currentUserId = req.body.id;
    const friendUsername = req.body.username;
    var friendRequestAlreadySent = false; //used to error check friend request
    var friendAlreadyCompleted = false; //used to error check friend request if they are already friends

    //check to see if user already sent a friend request to this user
    User.getUserByUsername(friendUsername, (err, friendUser) => {
        if (err)
            throw err;
         if (!friendUser) {
           return res.json({ success: false, msg: 'User not found' })
         }
         
        if (friendUser) {
            //checks to see if friendrequest to that friend already exists 
            for (var i = 0; i < friendUser.friendRequests.length; i++) {
                if (friendUser.friendRequests[i] == currentUserId)
                    friendRequestAlreadySent = true;

            }
                //checks to see if they are already friends with that user
            for (var i = 0; i < friendUser.friends.length; i++) {
                if (friendUser.friends[i] == currentUserId)
                    friendAlreadyCompleted = true;
            }

            if (friendRequestAlreadySent) {
                return res.json({ success: false, msg: 'You have already sent a friend request to that user.' });
            }

            if (friendAlreadyCompleted) {
                return res.json({ success: false, msg: 'You are already friends with that user.' });
            }

            else {



                User.getUserById(currentUserId, (err, loggedInUser) => {
                    if (err)
                        throw err;
                    if (!loggedInUser) {
                        return res.json({ success: false, msg: 'User not found' })
                    }
                    else {

                        //find user that the logged in user wants to add as a friend, and puts loggedin user as a friendrequest object in friendrequest array
                        User.findOneAndUpdate({ username: friendUsername },
                            { $push: { friendRequests: loggedInUser } }, (err, addedFriend) => {
                                if (err)
                                    throw err;
                                if (!addedFriend) {
                                    return res.json({ success: false, msg: 'User not found' })
                                }

                                if (addedFriend) {
                                    return res.json({ success: true, msg: 'Friend Request Sent!' })
                                }
                            });
                    }


                });
            }
        }

    });
});

//Once someone accepts friend request, goes to both user objects and updates friends array so they both are friends with each other
router.post('/confirmFriendRequest', (req, res, next) => {
    const currentUserId = req.body.id;

    const friendUsername = req.body.selectedFriendUsername;

    User.getUserByUsername(friendUsername, (err, friendUser) => {
        if (err) {
            throw err;
        }
        if (friendUser) {
            //update logged in user and adds friend object
            User.findOneAndUpdate({ _id: currentUserId },
                { $push: { friends: friendUser } }, (err, loggedInUser) => {
                    if (err)
                        throw err;
                    if (!loggedInUser) {
                        return res.json({ success: false, msg: 'User not found' })
                    }

                    if (loggedInUser) {


                        //deletes friend request from logged in user
                        User.findOneAndUpdate({ _id: currentUserId },
                            { $pull: { friendRequests: friendUser.id } }, (err, loggedInUser) => {
                                if (err)
                                    throw err;
                                if (!loggedInUser) {
                                    return res.json({ success: false, msg: 'User not found' })
                                }
                            });

                        //update selected user from front end and adds friend object
                        User.findOneAndUpdate({ username: friendUsername },
                            { $push: { friends: loggedInUser } }, (err, addedFriend) => {
                                if (err)
                                    throw err;
                                if (!addedFriend) {
                                    return res.json({ success: false, msg: 'User not found' })
                                }

                                if (addedFriend) {
                                    return res.json({ success: true, msg: 'You are now friends ' })
                                }
                            });


                    }
                });
        }

    });

});

//GetAllFriendRequestsFromUser
router.post('/getAllFriendRequests', (req, res, next) => {
    const user = req.body;
    var allFriendRequests = [];
    var j = 0;

    User.findById(user.id, (err, user) => {
        if (err)
            throw err;
        if (user) {

            if (!user.friendRequests) {
                return res.json({ success: false, message: 'No Friend Requests Found.' });
            }
            else {
                for (var i = 0; i < user.friendRequests.length; i++) {

                    //gets the statistics object from the id
                    User.find({ '_id': {    $in: [(user.friendRequests[i])]   }
                    }, function (err, friendRequest) {
                        if (err)
                            throw err;

                        if (friendRequest) {
                            j = j + 1

                            allFriendRequests.push(friendRequest);

                            if (j == user.friendRequests.length) {


                                res.json({ success: true, friendRequests: allFriendRequests });
                            }
                        }


                    })

                }


            }

        }


    });

});

//GetAllFriendsFromUser
router.post('/getAllFriends', (req, res, next) => {
    const user = req.body;
    var allFriends = [];
    var j = 0;
    User.findById(user.id, (err, user) => {
        if (err)
            throw err;
        if (user) {

            if (!user.friends) {
                return res.json({ success: false, message: 'No Friends Found.' });
            }
            else {
                for (var i = 0; i < user.friends.length; i++) {

                    //gets the statistics object from the id
                    User.find({
                        '_id': {
                            $in: [(user.friends[i])]
                        }
                    }, function (err, friend) {
                        if (err)
                            throw err;

                        if (friend) {
                            j = j + 1

                            allFriends.push(friend);

                            if (j == user.friends.length) {

                                res.json({ success: true, friends: allFriends });
                            }
                        }


                    })

                }


            }

        }


    });

});


//GetStatisticsFromUser
router.put('/getAllStatistics', (req, res, next) => {


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

                    //gets the statistics object from the id
                    Statistics.find({
                        '_id': {
                            $in: [(user.statistics[i])]
                        }
                    }, function (err, docs) {
                        if (err)
                            throw err;

                        if (docs) {
                            j = j + 1

                            allStatistics.push(docs);

                            if (j == user.statistics.length) {

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
