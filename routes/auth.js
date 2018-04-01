const express = require('express');
const User = require('../models/user');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');


// Post a new user (sign-up);
authRouter.post('/signup', (req, res) => {
    User.findOne({username: req.body.username}, (err, existingUser) => {
        console.error(err);
        if (err) return res.status(500).send({success: false, err});
        if (existingUser !== null){
            return res.status(400).send({success: false, err: "That username has already been taken"})
        }
        const newUser = new User(req.body);
        console.error(newUser);
        newUser.save((err, user) => {
            if (err) return res.status(500).send({success: false, err});
            const token = jwt.sign(user.toObject(), process.env.SECRET, {expiresIn: "24h"});
            res.send({user: user.withoutPassword(),token: token, success: true, message: "Here's your token!"});
        });
    });
});

authRouter.post("/login", function (req, res) {
    User.findOne({username: req.body.username}, function (err, user) {
        if (err) res.status(500).send(err);
        if (!user) {
            res.status(401).send({success: false, message: "User with the provided username was not found"})
        } else if (user) {
            user.checkPassword(req.body.password, function (err, match) {
                if (err) throw (err);
                if (!match) res.status(401).send({success: false, message: "Incorrect password"});
                else {
                    const token = jwt.sign(user.toObject(), process.env.SECRET, {expiresIn: "24h"});
                    res.send({user: user.withoutPassword(),token: token, success: true, message: "Here's your token!"});
                }
            });
        }
    });
});

authRouter.post("/change-password", function (req, res) {
    User.findById(req.user._id, function (err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            user.password = req.body.newPassword || user.password;
            user.save(function (err, user) {
                res.send({success: true, user: user.withoutPassword()});
            });
        }
    });
});

module.exports = authRouter;
