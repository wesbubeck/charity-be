const _ = require('lodash');
const User = require('./user-model');

const createUser = (userDetails) => User.create(userDetails);

const getUserById = (id) => User.findById(id)
    .lean()
    .exec();

const getAllUsers = () => User.find({})
    .lean()
    .exec();

const getPushValues = (eventsAttended, eventsFavorited, charitiesFavorited) => ({
    eventsAttended:
      eventsAttended.length > 0
          ? {
              $each: [...eventsAttended],
          }
          : null,
    eventsFavorited:
      eventsFavorited.length > 0
          ? {
              $each: [...eventsFavorited],
          }
          : null,
    charitiesFavorited:
      charitiesFavorited.length > 0
          ? {
              $each: [...charitiesFavorited],
          }
          : null,
});

const updateUserById = async (id, update) => {
    let updatedUser = {};

    if (
        _.get(update, 'eventsFavorited', []).length > 0
    || _.get(update, 'eventsAttended', []).length > 0
    || _.get(update, 'charitiesFavorited', []).length > 0
    ) {
        const updateObj = { ...update };
        delete updateObj.eventsAttended;
        delete updateObj.eventsFavorited;
        delete updateObj.charitiesFavorited;

        updatedUser = await User.findByIdAndUpdate(
            { _id: id },
            {
                $set: updateObj,
                $push: getPushValues(
                    update.eventsAttended,
                    update.eventsFavorited,
                    update.charitiesFavorited,
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
