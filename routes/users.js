const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Statistics = require('../models/statistics');
const AverageStat = require('../models/averageStat');
const Game = require('../models/game');



//Register
router.post('/register', (req, res, next) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        profilePicture: '/assets/images/blankProfilePicture.png'
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


router.put('/editUserProfileData', (req, res, next) => {

    User.findOneAndUpdate({ _id: req.body.id },
        {
            $set: {
               bio: req.body.bio,
               favouriteGame: req.body.favouriteGame,
               gamingSince: req.body.gamingSince,
               profilePicture: req.body.profilePicture,
               favouriteClip: req.body.favouriteClip  
            }
        }, (err, editedUser) => {
            if (err)
                 res.json({ success: false, err: err, msg: 'Failed to update user' });
            else {
                res.json({ success: true, editedUser: editedUser, msg: 'User updated' });
            }
        }

    );
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
                        email: user.email,
                        statistics: user.statistics,
                        friends: user.friends,
                        favouriteStats: user.favouriteStats
                    }
                });
            }
            else {
                return res.json({ success: false, msg: "Wrong Password" });
            }
        });
    });
});

router.put('/getUserObjectById', (req, res, next) => {
    var userId = req.body.id
    User.findById(userId, (err, userObj) => {
        if (!userObj)
            return res.json({ success: false, msg: 'User not found' })
        else
            return res.json({ success: true, userObj: userObj, msg: 'User found' })
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
    var friendRequestPending = false; //used to error check if they have this friend as a waiting friend request


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

                        //checks to see if they are already have a friend request from that user pending
                        for (var i = 0; i < loggedInUser.friendRequests.length; i++) {
                            if (loggedInUser.friendRequests[i] == friendUser.id)
                                friendRequestPending = true;
                        }

                        if (friendRequestPending) {
                            return res.json({ success: false, msg: 'You already have a pending friend request from that user.' });
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
                    }


                });
            }
        }

    });
});

router.post('/declineFriendRequest', (req, res, next) =>{
    const currentUserId = req.body.id;
     const friendRequestId = req.body.friendRequestId;
   

         User.findOneAndUpdate({ _id: currentUserId },
        { $pull: { friendRequests: friendRequestId } }, (err, loggedInUser) => {
            if (err)
                throw err;
            if (!loggedInUser) {
                return res.json({ success: false, msg: 'User not found' })
            }
            if(loggedInUser)
            return res.json({ success: true, msg: 'Friend Request Deleted' })
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
                    User.find({
                        '_id': { $in: [(user.friendRequests[i])] }
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

//checks to see if the user has already favourited this stat or not
router.put('/getFavouriteStatLikeStatus', (req, res, next) => {
    
     AverageStat.getAverageStatByName(req.body.statName).then(averageStatObject => {
         User.getAllFavouriteStats(req.body.userId).then(allUsersFavouriteStats => {
             
 
             //this is checking if user already has stat favourited. if it equals -1 that means they dont have that stat in the array
             if ((allUsersFavouriteStats.indexOf(averageStatObject.id)) == '-1') {
                return res.json({ success: false, status: false, msg: "You don't have that stat favourited" })
             }
             else {
                 return res.json({ success: true, status: true, msg: "You already have that stat favourited!" })
             }
 
 
         });
 
     });
 
 });

router.put('/removeFavouriteStat', (req, res, next) => {
   
    AverageStat.getAverageStatByName(req.body.statName).then(averageStatObject => {
        User.getAllFavouriteStats(req.body.userId).then(allUsersFavouriteStats => {

            //this is checking if user already has stat favourited. if it equals -1 that means they dont have that stat in the array
            if ((allUsersFavouriteStats.indexOf(averageStatObject.id)) != '-1') {
                User.findOneAndUpdate({ _id: req.body.userId },
                    { $pull: { favouriteStats: averageStatObject.id } }, (err, addedStat) => {
                        if (err)
                            throw err;
                        if (!addedStat) {
                            return res.json({ success: false, msg: 'Stat unable to be added' })
                        }

                        if (addedStat) {
                            return res.json({ success: true, msg: 'Favourite Stat Removed!' })
                        }
                    });
            }
            else {
                return res.json({ success: false, msg: "You don't have that stat favourited" })
            }


        });

    });

});

//addFavouriteStat
//looks through all the users current faviourte stats to make sure they have already not added this stat
router.put('/addFavouriteStat', (req, res, next) => {
    AverageStat.getAverageStatByName(req.body.statName).then(averageStatObject => {
        User.getAllFavouriteStats(req.body.userId).then(allUsersFavouriteStats => {

            //this is checking if user already has stat favourited. if it equals -1 that means they dont have that stat in the array
            if ((allUsersFavouriteStats.indexOf(averageStatObject.id)) == '-1') {
                User.findOneAndUpdate({ _id: req.body.userId },
                    { $push: { favouriteStats: averageStatObject } }, (err, addedStat) => {
                        if (err)
                            throw err;
                        if (!addedStat) {
                            return res.json({ success: false, msg: 'Stat unable to be added' })
                        }

                        if (addedStat) {
                            return res.json({ success: true, msg: 'Favourite Stat Added!' })
                        }
                    });
            }
            else {
                return res.json({ success: false, msg: 'You already have that stat favourited!' })
            }


        });

    });

});

//gets the specific number for stat for the user. UsersStat is the users statistic object
router.put('/getSpecificUserStat', (req, res, next) => {
    var splitUpLocation = req.body.averageStat.completeLocation.split(','); //here we split up the location of the specific stat so we can parse to it
    // var usersStat = req.body.usersStat;//UsersStat is the users whole statistic object

    /*Quite complicated will explain. We grabb all stats ids for user and grab all games.
    We then grab the stat object for each stat id and compare the game attached to that stat object to each game availabe
    if we get a match on that then thats one step complete, we must also have the same game object on that statistic as the average stat passed throguh the parameter
    if all this is true then we pass it into a function below and parse it to retrive the number for the specific stat */
    User.getAllStatisticsIdsByUserId(req.body.userId).then(allUsersStatIds => {
        Game.getAllGames().then(games => {
            allUsersStatIds.forEach(function (statId) {
                Statistics.getStatisticsById(statId, (err, statObject) => {

                    if (games.indexOf(statObject.game) && req.body.averageStat.game == statObject.game) {
                        getDataFromLocation(splitUpLocation, statObject)


                    }
                });
            });

        });
    });

    function getDataFromLocation(location, usersStat) {
        var usersSpecificStat //this is what we assign the specific number in the stat we are looking for
        const statLocationTier1 = splitUpLocation[0];
        const statLocationTier2 = splitUpLocation[1];
        const statLocationTier3 = splitUpLocation[2];
        const statLocationTier4 = splitUpLocation[3];
        const statLocationTier5 = splitUpLocation[4];

        if (statLocationTier2 == 'undefined') {
            usersSpecificStat = parseInt(usersStat[statLocationTier1]);
        }
        else if (statLocationTier3 == 'undefined') {
            usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2]);
        }
        else if (statLocationTier4 == 'undefined') {
            usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2][statLocationTier3]);
        }
        else if (statLocationTier5 == 'undefined') {
            usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2][statLocationTier3][statLocationTier4]);
        }
        else {
            usersSpecificStat = parseInt(usersStat[statLocationTier1][statLocationTier2][statLocationTier3][statLocationTier4][statLocationTier5]);
        }

        if (usersSpecificStat.isNullOrUndefined) {
            console.log("Average Stat failed to find for user")
            return res.json({ success: false, msg: 'Statistic not Found' })
        }
        else {
            return res.json({ success: true, averageStat: req.body.averageStat, usersSpecificStat: usersSpecificStat, msg: 'Statistic Found' })
        }
    }


});


//GetStatisticsFromUser
router.put('/getAllStatisticsForLoggedInUser', (req, res, next) => {


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
