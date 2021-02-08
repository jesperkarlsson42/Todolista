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
  const sorted = +req.query.sorted || 1;
  const page = +req.query.page || 1;
  const totalData = await Todo.find().countDocuments();
  let a = totalData / 10;
  let x = Math.ceil(a);

  if (x < page) {
    res.redirect("/?page=1");
  } else {
    try {
      let dataPerPage = 10;
      const totalDataPart = Math.ceil(totalData / dataPerPage);
      dataToShow = dataPerPage * page;
      if (page === 1) {
        const data = await Todo.find().limit(10).sort({ date: sorted });
        res.render("todos.ejs", {
          todos: data,
          totalData,
          dataPerPage,
          totalDataPart,
          dataToShow,
          page,
          sorted
        });
      } else {
        const data = await Todo.find()
          .limit(10)
          .sort({ date: sorted })
          .skip((page - 1) * 10);
        res.render("todos.ejs", {
          todos: data,
          totalData,
          dataPerPage,
          totalDataPart,
          dataToShow,
          page,
          sorted
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
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
  const sorted = +req.query.sorted || 1;
  const page = +req.query.page || 1;
  const totalData = await Todo.find().countDocuments();
  let a = totalData / 10;
  let x = Math.ceil(a);
  const id = req.params.id;
  if (x < page) {
    res.redirect("/?page=1");
  } else {
    try {
      let dataPerPage = 10;
      const totalDataPart = Math.ceil(totalData / dataPerPage);
      dataToShow = dataPerPage * page;
      if (page === 1) {
        const data = await Todo.find()
          .limit(10)
          .sort({ date: sorted })
          .exec(function (err, data) {
            res.render("editTask.ejs", {
              page,
              todos: data,
              totalData,
              dataPerPage,
              totalDataPart,
              dataToShow,
              taskId: id,
              sorted
            });
          });
      } else {
        const data = await Todo.find()
          .limit(10)
          .sort({ date: sorted })
          .skip((page - 1) * 10)
          .exec(function (err, data) {
            res.render("editTask.ejs", {
              page,
              todos: data,
              totalData,
              dataPerPage,
              totalDataPart,
              dataToShow,
              taskId: id,
              sorted
            });
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
});



app.post("/edit/:id", async (req, res,) => {
  const id = req.params.id;
  const sorted = +req.query.sorted || 1;
  let page = +req.query.page || 1;
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
