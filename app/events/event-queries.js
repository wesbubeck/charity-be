const Event = require('./event-model');
const Charity = require('../charities/charity-queries');

const createEvent = async (eventDetails) => {
    const createdEvent = await Event.create(eventDetails);
    const charity = await Charity.getCharityById(eventDetails.charity);
    const charityEvents = charity.events;

    // eslint-disable-next-line no-underscore-dangle
    charityEvents.push(createdEvent._id);

    await Charity.updateCharityById(eventDetails.charity, {
        events: charityEvents,
    });

    return createdEvent;
};

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
