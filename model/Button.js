const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const buttonSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    timesPressed: {
        type: Number,
        default: 0
    }, 
    createdAt: {
        type: Date,
        default: Date.now
    },
    log: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('Button', buttonSchema);