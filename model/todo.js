const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 5,
        uppercase: true
    },
    
        date: {
            type: Date,
            default: Date.now
        }
})

const Todo = mongoose.model("todo", todoSchema);
module.exports = Todo;
