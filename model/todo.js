const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
    task: {
        type: String,
        required: true,
    },
    
        date: {
            type: Date,
            default: Date.now
        }
})

const Todo = mongoose.model("todo", todoSchema);
module.exports = Todo;
