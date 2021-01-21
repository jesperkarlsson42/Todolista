const express = require('express');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const todo = require('./model/todo');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/static", express.static(__dirname + "/public"));

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {

    const data = await todo.find();
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