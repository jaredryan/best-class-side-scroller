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
    User.findById(req.params.id, (err, user) => {  // Use findOne() to add user search criteria
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send("No user item found");
        return res.send(user);
    })
})

userRouter.post('/', (req, res) => {
    const user = new User(req.body);
    user.save((err, newUser) => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(newUser);
    })
})



userRouter.put('/:id', (req, res) => {
    User.findByIdAndUpdate( // Use findOneAndUpdate() to include user.
        req.params.id,
        req.body,
        {new: true},
        (err, updatedUser) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedUser);
    })
})

userRouter.delete('/:id', (req, res) => {
    User.findByIdAndRemove( // change to findeOneAndRemove() to add user criteria
        req.params.id, (err, deletedUser) => {
        if (err) return res.status(500).send(err);
        return res.send(deletedUser);
    })
})

module.exports = userRouter;
