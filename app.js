const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const router = require("./routes/index");

const app = express();
const http = require("http").Server(app);
const io = require("./socket")(http);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', router);

mongoose.connect(process.env.MONGO_DB_URL, { useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>{
        console.log("Connected to mongoDB");
        http.listen(3007);
    })
    .catch(err => {
        console.log(err);
    });
