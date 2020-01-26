const { get } = require('lodash');
const User = require('./user-model');

const createUser = (userDetails) => User.create(userDetails);

const getUserById = (id) => User.findById(id)
    .lean()
    .exec();

const getAllUsers = () => User.find({})
    .lean()
    .exec();

const getPushValues = (eventsAttendedValue, eventsFavoritedValue, charitiesFavoritedValue) => {
    const pushValue = {};
    if (eventsAttendedValue.length > 0) pushValue.eventsAttended = eventsAttendedValue;

    if (eventsFavoritedValue.length > 0) pushValue.eventsFavorited = eventsFavoritedValue;

    if (charitiesFavoritedValue.length > 0) pushValue.charitiesFavorited = charitiesFavoritedValue;

    return pushValue;
};

const updateUserById = async (id, update) => {
    let updatedUser;
    const eventsAttendedCopy = get(update, 'eventsAttended', []);
    const eventsFavoritedCopy = get(update, 'eventsFavorited', []);
    const charitiesFavoritedCopy = get(update, 'charitiesFavorited', []);

    if (
        eventsAttendedCopy.length > 0
        || eventsFavoritedCopy.length > 0
        || charitiesFavoritedCopy.length > 0
    ) {
        const updatedCopy = { ...update };
        delete updatedCopy.eventsAttended;
        delete updatedCopy.eventsFavorited;
        delete updatedCopy.charitiesFavorited;

        updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: updatedCopy,
                $addToSet: getPushValues(
                    eventsAttendedCopy,
                    eventsFavoritedCopy,
                    charitiesFavoritedCopy,
                ),
            },
            {
                new: true,
            },
        );

        return updatedUser;
    }

    updatedUser = User.findByIdAndUpdate(id, update, {
        new: true,
    });

    return updatedUser;
};

const removeUserById = (id) => User.findByIdAndDelete(id).exec();

module.exports = {
    createUser,
    getUserById,
    updateUserById,
    removeUserById,
    getAllUsers,
    getPushValues,
};
