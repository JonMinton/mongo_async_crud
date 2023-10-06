const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// Create a schema for the DeliveredContent object
// Which has a title and a content
// the title is a string
// the content is html formatted text
// the date the entry was created
// the author of the entry
// the date the entry was last updated
const deliveredContentSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
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

module.exports = mongoose.model('DeliveredContent', deliveredContentSchema);