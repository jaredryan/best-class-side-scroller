const express = require('express');
const User = require('../models/user');
const userRouter = express.Router();

userRouter.get('/all', (req, res) => {
    User.find((err, users) => {  // add user: req.user._id to filter out only users linked to the logged in user.
        if (err) return res.status(500).send(err);
        if (req.user.admin === true) return res.send(users);
        return res.status(404).send("User is not an admin");
    })
})

userRouter.get('/', (req, res) => {
    User.findById(req.user._id, (err, users) => {  // add user: req.user._id to filter out only users linked to the logged in user.
        if (err) return res.status(500).send(err);
        return res.send(users);
    })
})

userRouter.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.user._id, req.body, {new: true},
        (err, updatedUser) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedUser);
    })
})

userRouter.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.user._id, (err, deletedUser) => {
        if (err) return res.status(500).send(err);
        return res.send(deletedUser);
    })
})

module.exports = userRouter;
