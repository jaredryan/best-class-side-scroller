const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const port = process.env.PORT || 8000;
const path = require("path");
const expressJwt = require("express-jwt");
require("dotenv").config()

const app = express();

app.use(express.static(path.join(__dirname, "client", "build")))
app.use(bodyParser.json());
app.use(morgan("dev"));
// app.use("/api", expressJwt({secret: process.env.SECRET}));

// Routes (CHANGE AS APPROPRIATE)
app.use("/api/user", require('./routes/user'));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/gamers", err => {
    if (err) throw err;
    console.log("Connected to the database.");
});

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port, () => {
    console.log(`We've got er runnin on port ${port}.`);
});
