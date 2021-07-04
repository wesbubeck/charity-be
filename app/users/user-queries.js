const { get } = require('lodash');
const User = require('./user-model');

const createUser = (userDetails) => User.create(userDetails);

const getUserById = (id) => User.findById(id)
    .lean()
    .exec();

const getAllUsers = () => User.find({})
    .lean()
    .exec();

const getPushValues = (
    eventsAttendedIdsValue,
    eventsFavoritedIdsValue,
    charitiesFavoritedIdsValue,
) => {
    const pushValue = {};
    if (eventsAttendedIdsValue.length > 0) {
        pushValue.eventsAttendedIds = eventsAttendedIdsValue;
    }

    if (eventsFavoritedIdsValue.length > 0) {
        pushValue.eventsFavoritedIds = eventsFavoritedIdsValue;
    }

    if (charitiesFavoritedIdsValue.length > 0) {
        pushValue.charitiesFavoritedIds = charitiesFavoritedIdsValue;
    }

    return pushValue;
};

const updateUserById = async (id, update) => {
    let updatedUser;
    const eventsAttendedIdsCopy = get(update, 'eventsAttendedIds', []);
    const eventsFavoritedIdsCopy = get(update, 'eventsFavoritedIds', []);
    const charitiesFavoritedIdsCopy = get(update, 'charitiesFavoritedIds', []);

    if (
        eventsAttendedIdsCopy.length > 0
        || eventsFavoritedIdsCopy.length > 0
        || charitiesFavoritedIdsCopy.length > 0
    ) {
        const updatedCopy = { ...update };
        delete updatedCopy.eventsAttendedIds;
        delete updatedCopy.eventsFavoritedIds;
        delete updatedCopy.charitiesFavoritedIds;

        updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: updatedCopy,
                $addToSet: getPushValues(
                    eventsAttendedIdsCopy,
                    eventsFavoritedIdsCopy,
                    charitiesFavoritedIdsCopy,
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
