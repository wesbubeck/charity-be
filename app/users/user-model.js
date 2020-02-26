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
    eventsAttendedIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'event',
    },
    eventsFavoritedIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'event',
    },
    charitiesFavoritedIds: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'charity',
    },
    // I need to add an array of ID's attendedEvents, savedEvents,
    // charites which are charities that attended charities favorted
});

module.exports = mongoose.model('user', userSchema);
