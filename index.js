const express = require('express');
const app = express();
require("dotenv").config();
const morgan = require('morgan')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressJwt = require('express-jwt');
const path = require("path")
const PORT = process.env.PORT || 8000;
const secret = process.env.SECRET || "local passphrase spacey goodness";

app.use(express.static(path.join(__dirname, "client", "build")))
app.use(morgan("dev"));
app.use(bodyParser.json());  // makes it so we can access the request information as req.body in our routes.

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/gamers', (err) => {
        if (err) throw err;
        console.log("Connected to the database");
    }
);

app.use('/profile', require('./routes/profile'));
app.use('/api', expressJwt({secret}));  // makes it so we can access the user as req.user in our routes.
app.use('/api/user', require('./routes/user'));
app.use('/api/score', require('./routes/score'));
app.use("/auth/change-password", expressJwt({secret}));
app.use('/auth', require('./routes/auth'));


app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`)
});
