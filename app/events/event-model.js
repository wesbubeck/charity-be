import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    dateOfEvent: {
        type: Date,
        required: true,
    },
    eventContact: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    eventEmail: {
        type: String,
        required: true,
    },
    eventDetails: {
        type: String,
        required: true,
    },
    charityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'charity',
        required: true,
    },
});

module.exports = mongoose.model('event', eventSchema);
