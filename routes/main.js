const express = require("express");
const router = express.Router();
const Todo = require("../model/todo");

router.get("/", async (req, res) => {
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
          sorted,
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
          sorted,
        });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

router.post("/", async (req, res) => {
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

router.get("/delete/:id", async (req, res) => {
  await Todo.deleteOne({ _id: req.params.id });
  res.redirect("/");
});

router.get("/edit/:id", async (req, res) => {
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
              sorted,
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
              sorted,
            });
          });
      }
    } catch (err) {
      console.log(err);
    }
  }
});

router.post("/edit/:id", async (req, res) => {
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

module.exports = router;
