const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const Todo = require("./model/todo");
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static(__dirname + "/public"));

app.set("view engine", "ejs");

app.get("/", async (req, res) => {
  try {
    const data = await Todo.find();
    res.render("todos.ejs", { todos: data });
  } catch (err) {
    console.log(err);
  }
});
let x = 1;
let page = 1;
let limit = 5;

app.get("/pagination/:id", async (req, res) => {
  
  x--;
  let a = { page, limit };

  req.params.id == "task";
  a = req.query;
  const data = await Todo.find()
    .limit(limit * 1)
    .skip((page - x) * limit);
  res.render("todos.ejs", { todos: data });
  console.log(x);
  return;
});

app.post("/", async (req, res) => {
  const newTask = new Todo({
    task: req.body.task,
  });
  try {
    await newTask.save();
    res.redirect("/");
  } catch (err) {
    res.redirect("/");
  }
});

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

app.get("/delete/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id });
  res.redirect("/");
});

app.get("/edit/:id", async (req, res) => {
  const id = req.params.id;
  await Todo.find({}, (err, data) => {
    res.render("editTask.ejs", { todos: data, taskId: id });
  });
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  await Todo.findByIdAndUpdate(id, { task: req.body.task }, (err) => {
    if (err) {
      console.log("Error Edit task");
      res.send(500, err);
      return;
    } else {
      res.redirect("/");
    }
  });
});
