const Event = require('./event-model');

const createEvent = (eventDetails) => Event.create(eventDetails);

const getEventById = (id) => Event.findById(id)
    .lean()
    .exec();

const getAllEvents = () => Event.find({})
    .lean()
    .exec();

const updateEventById = (id, update) => Event.findByIdAndUpdate(id, update, {
    new: true,
}).exec();

const removeEventById = (id) => {
    Event.findByIdAndDelete(id).exec();
};

module.exports = {
    createEvent,
    getEventById,
    updateEventById,
    removeEventById,
    getAllEvents,
};
