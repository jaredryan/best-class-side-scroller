const express = require('express');
const User = require('../models/user');
const userRoutes = express();

userRoutes.get('/', (req, res) => {
    User.find((err, users) => {
        if (err) return res.status(500).send(err);
        return res.send(users);
    });
});

userRoutes.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).send(err);
        return res.send(user);
    });
});

userRoutes.post('/', (req, res) => {
    const newUser = new User(req.body);
    newUser.save(err => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(newUser);
    });
});

userRoutes.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, (err, updatedUser) => {
        if (err) return res.status(500).send(err);
        return res.send(updatedUser);
    });
});

userRoutes.delete('/:id', (req, res) => {
    User.findByIdAndRemove(req.params.id, (err, removedUser) => {
        if (err) return res.status(500).send(err);
        return res.status(202).send(removedUser);
    });
});

module.exports = userRoutes;
