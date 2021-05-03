const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require("mongoose")
require("dotenv").config();

const indexRouter = require('./routes/index');

const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);

mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("Connected to mongoDB");
        app.listen(3007);
    })
    .catch(err => {
        console.log(err);
    });
