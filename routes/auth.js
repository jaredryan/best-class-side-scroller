const express = require('express');
const User = require('../models/user');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const async = require("async");
const crypto = require("crypto");

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
    User.findOne({email: req.body.email}, function (err, user) {
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

authRouter.put("/change-password", function (req, res) {
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

authRouter.post("/forgot", function (req, res, next) {
    /*
    * async.waterfall takes an array of functions to run one after the other. The last parameter to each of these
    * functions should be a callback function that you'll execute when you're ready to move to the next function in the
    * array. Whatever parameters you pass to this callback function (which we've called `done`) are the parameters that
    * will be passed to the next function in the array (assuming no errors).
    * */
    async.waterfall([
        function (done) {
            crypto.randomBytes(20, function (err, buf) {
                if (err) return done(err);
                var token = buf.toString("hex");

                // Pass `null` for the "error" and the token to the next function in the array
                done(null, token);
            });
        },
        // Received the token from the previous function
        function (token, done) {

            // Find the user by their email address provided in the req.body
            User.findOne({email: req.body.email}, function (err, user) {
                if (err) return res.send(err);

                // If they submitted an email that doesn't belong to any users in the database:
                else if (!user) return res.status(404).send({
                    success: false,
                    message: "The email " + req.body.email + " isn't registered in the system"
                });

                // Set the password reset token on the user object and give them 1 hour to click the link we'll send
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000;  // 1 hour
                user.save(function (err) {

                    // pass the token and the user object to the next function in the array
                    done(err, token, user);
                });
            });
        },
        function (token, user, done) {

            // Create a new email using the sendgrid npm package
            var helper = require("sendgrid").mail;

            // Who you want this email to be "coming from". This doesn't have to be a real email address.
            var fromEmail = new helper.Email("noreply@nestinvaders.io");

            // Send the email to the address provided by the user trying to reset their password
            var toEmail = new helper.Email(user.email);

            // Email subject line
            var subject = "Your Nest Invaders password reset link is here";

            // Actual content of the email. You can make this look pretty by using text/html instead of text/plain
            var content = new helper.Content("text/plain", 'You are receiving this because you (or someone else) ' +
                'have requested the reset of the password for your account.\n\n' +
                'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n');

            // Put all those pieces together to make an email object
            var mail = new helper.Mail(fromEmail, subject, toEmail, content);

            // Prove you're allowed to use sendgrid by providing your API key
            var sendgrid = require("sendgrid")(process.env.SENDGRIDAPIKEY);

            // Create a request object
            var request = sendgrid.emptyRequest({
                method: 'POST',
                path: '/v3/mail/send',
                body: mail.toJSON()
            });

            // Send the request to the sendgrid API, which will send the email for you!
            sendgrid.API(request, function (err, response) {
                if (err) return res.status(500).send(err);
                done(null, "done");
            });
        }

        // This last function (outside the array of functions) is called regardless what happens. If there is an error
        // at any point in the array of functions, it'll skip the remaining functions in the array and call this one
        // instead. If there are no errors, this will get called last, but with `null` for the `err` parameter.
    ], function (err, result) {
        if (err) return res.status(500).send(err);

        // Send a response back to the frontend.
        res.status(202).send({success: true, message: "Mail sent successfully!"});
    })
});

authRouter.post("/reset/:resetToken", function (req, res) {
    User.findOne({resetPasswordToken: req.params.resetToken}, function (err, user) {
        if (err) {
            res.status(500).send(err);
        } else {
            user.password = req.body.password || user.password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function (err, user) {
                res.send({success: true, message: "Password successfully reset!"});
            });
        }
    });
});

module.exports = authRouter;
