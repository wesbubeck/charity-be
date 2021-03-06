const Charity = require('./charity-model');

const createCharity = (charityDetails) => Charity.create(charityDetails);

const getCharityById = (id) => Charity.findById(id)
    .lean()
    .exec();

const getManyCharitiesById = (ids) => Charity.find({ _id: { $in: ids } })
    .lean()
    .exec();

const getAllCharities = () => Charity.find({})
    .lean()
    .exec();

const updateCharityById = (id, update) => Charity.findByIdAndUpdate(id, update, {
    new: true,
}).exec();

const removeCharityById = (id) => Charity.findByIdAndDelete(id).exec();

module.exports = {
    createCharity,
    getCharityById,
    getManyCharitiesById,
    updateCharityById,
    removeCharityById,
    getAllCharities,
};
