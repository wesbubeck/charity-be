const mongoose = require('mongoose');

const charitySchema = new mongoose.Schema({

    charityName: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    events: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'event',
    },
});

module.exports = mongoose.model('charity', charitySchema);
