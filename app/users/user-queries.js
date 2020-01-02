const User = require('./user-model');

const createUser = (userDetails) => User.create(userDetails);

const getUserById = (id) => User.findById(id)
    .lean()
    .exec();

const getAllUsers = () => User.find({})
    .lean()
    .exec();

const updateUserById = (id, update) => User.findByIdAndUpdate(id, update, {
    new: true,
});

const removeUserById = (id) => {
    User.findByIdAndDelete(id);
};

module.exports = {
    createUser,
    getUserById,
    updateUserById,
    removeUserById,
    getAllUsers,
};
