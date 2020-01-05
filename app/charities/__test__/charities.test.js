/* eslint-disable no-underscore-dangle */

const mongoose = require('mongoose');
const Charity = require('../charity-queries');


describe('insert', () => {
    let createdCharityOne;
    let createdCharityTwo;
    const charityDataOne = {
        address: '123 beet farm ave',
        email: 'nard.dog@dunder.com',
        charityName: 'Conn Casual Chaps',
    };
    const charityDataTwo = {
        address: '134 dunder way',
        email: 'm.scott@dunder.com2',
        charityName: 'Scotts tots',

    };

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test('should create a new charity', async () => {
        createdCharityOne = await Charity.createCharity({
            charityName: charityDataOne.charityName,
            address: charityDataOne.address,
            email: charityDataOne.email,
        });

        expect(createdCharityOne.charityName).toBe(charityDataOne.charityName);
        expect(createdCharityOne.email).toBe(charityDataOne.email);
        expect(createdCharityOne.address).toBe(charityDataOne.address);
    });

    test('should create another new charity', async () => {
        createdCharityTwo = await Charity.createCharity({
            charityName: charityDataTwo.charityName,
            address: charityDataTwo.address,
            email: charityDataTwo.email,
        });

        expect(createdCharityTwo.charityName).toBe(charityDataTwo.charityName);
        expect(createdCharityTwo.email).toBe(charityDataTwo.email);
        expect(createdCharityTwo.address).toBe(charityDataTwo.address);
    });

    test('should get a charity by id', async () => {
        const getCharityTwo = await Charity.getCharityById(createdCharityTwo._id);

        expect(getCharityTwo.charityName).toBe(charityDataTwo.charityName);
        expect(getCharityTwo.email).toBe(charityDataTwo.email);
        expect(getCharityTwo.address).toBe(charityDataTwo.address);
    });

    test('should get all charities', async () => {
        const allCharities = await Charity.getAllCharities();
        const charityIds = allCharities.map((charity) => charity._id);

        expect(allCharities).toHaveLength(2);
        expect(charityIds)
            .toEqual(expect.arrayContaining([createdCharityTwo._id, createdCharityOne._id]));
    });

    test('should update a charity by id', async () => {
        const updatedCharityTwo = await Charity.updateCharityById(createdCharityTwo._id, {
            email: 'new.email@test.com',
        });

        expect(updatedCharityTwo.charityName).toBe(charityDataTwo.charityName);
        expect(updatedCharityTwo.email).toBe('new.email@test.com');
        expect(updatedCharityTwo.address).toBe(charityDataTwo.address);
    });

    test('should delete a charity by id', async () => {
        await Charity.removeCharityById(createdCharityTwo._id);
        const allCharitiesAfterDelete = await Charity.getAllCharities();
        const charityIdsAfterDelete = allCharitiesAfterDelete.map((charity) => charity._id);

        expect(allCharitiesAfterDelete).toHaveLength(1);
        expect(charityIdsAfterDelete)
            .not.toEqual(expect.arrayContaining([createdCharityTwo._id, createdCharityOne._id]));
        expect(charityIdsAfterDelete).toEqual(expect.arrayContaining([createdCharityOne._id]));
    });
});
