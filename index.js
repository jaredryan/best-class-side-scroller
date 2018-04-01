const express = require('express');
const app = express();
require("dotenv").config();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const PORT = process.env.PORT || 5000;


app.use(morgan("dev"));
app.use(bodyParser.json());  // makes it so we can access the request information as req.body in our routes.

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/todo-auth1',
    {useMongoClient: true}, // helps get rid of deprecation warnings
    (err) => {
        if (err) throw err;
        console.log("Connected to the database");
    }
);


app.use('/api', expressJwt({secret: process.env.SECRET}));  // makes it so we can access the user as req.user in our routes.

app.use('/api/todo', require('./routes/todo'));
app.use("/auth/change-password", expressJwt({secret: process.env.SECRET}));
app.use('/auth', require('./routes/auth'));
app.use('/profile', require('./routes/profile'));


app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
});
