const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const router = require("./routes/main.js");

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/static", express.static(__dirname + "/public"));

mongoose.set("useFindAndModify", false);
app.set("view engine", "ejs");

app.use("/", router);

const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(process.env.DB_CONNECT, options, (err) => {
  if (err !== null) {
    console.log("error connecting to DB");
    return;
  }

  app.listen(8000, (err) => {
    console.log("application is running on port 8000");
  });
});




