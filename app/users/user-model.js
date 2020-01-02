const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    eventsAttended: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'event',
    },
    eventsFavorited: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'event',
    },
    eventsSaved: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'event',
    },
    charitiesFavorited: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'charity',
    },
    // I need to add an array of ID's attendedEvents, savedEvents,
    // charites which are charities that attended charities favorted
});

module.exports = mongoose.model('user', userSchema);
