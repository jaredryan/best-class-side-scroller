const express = require('express');
const Todo = require('../models/todo');
const todoRouter = express.Router();

todoRouter.get('/', (req, res) => {
    Todo.find({user: req.user._id}, (err, todos) => {  // add user: req.user._id to filter out only todos linked to the logged in user.
        if (err) return res.status(500).send(err);
        return res.send(todos);
    })
})

todoRouter.post('/', (req, res) => {
    const todo = new Todo(req.body);
    todo.user = req.user._id;  // sets the user property of a todo to the req.user._id so the todo and user are connected.
    todo.save((err, newTodo) => {
        if (err) return res.status(500).send(err);
        return res.status(201).send(newTodo);
    })
})

todoRouter.get('/:id', (req, res) => {
    Todo.findOne({_id: req.params.id, user: req.user._id}, (err, todo) => {  // Use findOne() to add user search criteria
        if (err) return res.status(500).send(err);
        if (!todo) return res.status(404).send("No todo item found");
        return res.send(todo);
    })
})

todoRouter.put('/:id', (req, res) => {
    Todo.findOneAndUpdate( // Use findOneAndUpdate() to include user.
        {_id: req.params.id, user: req.user._id},
        req.body,
        {new: true},
        (err, updatedTodo) => {
            if (err) return res.status(500).send(err);
            return res.send(updatedTodo);
    })
})

todoRouter.delete('/:id', (req, res) => {
    Todo.findOneAndRemove( // change to findeOneAndRemove() to add user criteria
        {_id: req.params.id, user: req.user._id}, (err, deletedTodo) => {
        if (err) return res.status(500).send(err);
        return res.send(deletedTodo);
    })
})

module.exports = todoRouter;
