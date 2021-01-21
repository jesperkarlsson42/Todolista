const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();
const Todo = require('./model/todo');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static(__dirname + "/public"));


app.set('view engine', 'ejs');

app.get('/', async (req, res) => {

    const data = await Todo.find();
    res.render("todos.ejs", {todos: data});
});

app.post('/', async (req, res) => {
    const newTask = new todo ({
        task: req.body.task
    });
    try {
        await newTask.save();
        res.redirect("/");
    }
    catch(err) {
        res.redirect("/");
    }

})

const options = { useNewUrlParser: true, useUnifiedTopology: true }

mongoose.connect(process.env.DB_CONNECT,
    options,
    (err) => {
      console.log(err);
  
      if (err) return;
      console.log("connected to db!");
  
      app.listen(8000, (err) => {
        console.log("application is running on port 8000");
      });
    }
  );

  
app.get('/delete/:id', async (req, res) => {
    await Todo.deleteOne({_id:req.params.id});
    res.redirect("/");
})