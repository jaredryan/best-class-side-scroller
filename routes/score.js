const express = require('express');
const Score = require('../models/score');
const scoreRouter = express.Router();

scoreRouter.get('/', (req, res) => {
    Score.find({username: req.user.username}, (err, scores) => {  // add username: req.user.username to filter out only scores linked to the logged in user.
        if (err) return res.status(500).send(err);
        return res.send(scores);
    })
})

scoreRouter.get('/all', (req, res) => {
    Score.find((err, scores) => {
        if (err) return res.status(500).send(err);
        return res.send(scores);
    })
})

scoreRouter.post('/', (req, res) => {
    const score = new Score(req.body);
    score.username = req.user.username;  // sets the user property of a score to the req.user._id so the score and user are connected.
    score.save((err, newScore) => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(newScore);
    })
})

scoreRouter.get('/:id', (req, res) => {
    Score.findOne({_id: req.params.id, username: req.user.username}, (err, score) => {  // Use findOne() to add user search criteria
        if (err) return res.status(500).send(err);
        if (!score) return res.status(404).send("No score found");
        return res.send(score);
    })
})

scoreRouter.put('/:id', (req, res) => {
    Score.findOneAndUpdate( // Use findOneAndUpdate() to include user.
        {_id: req.params.id, username: req.user.username},
        req.body,
        {new: true},
        (err, updatedScore) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedScore);
    })
})

scoreRouter.delete('/:id', (req, res) => {
    Score.findOneAndRemove( // change to findeOneAndRemove() to add user criteria
        {_id: req.params.id, username: req.user.username}, (err, deletedScore) => {
        if (err) return res.status(500).send(err);
        return res.send(deletedScore);
    })
})

module.exports = scoreRouter;
