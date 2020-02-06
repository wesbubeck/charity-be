/* eslint-disable no-underscore-dangle */

import mongoose from 'mongoose';
import Charity from '../charity-queries';

describe('Charities', () => {
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

    const charityKeys = [
        'address',
        'email',
        'charityName',
    ];

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        const collections = await mongoose.connection.db.collections();

        collections.forEach(async (collection) => {
            await collection.remove();
        });

        await mongoose.connection.close();
    });

    test('should create a new charity', async () => {
        createdCharityOne = await Charity.createCharity({
            charityName: charityDataOne.charityName,
            address: charityDataOne.address,
            email: charityDataOne.email,
        });

        charityKeys.forEach((key) => {
            expect(createdCharityOne[key]).toEqual(charityDataOne[key]);
        });
    });

    test('should create another new charity', async () => {
        createdCharityTwo = await Charity.createCharity({
            charityName: charityDataTwo.charityName,
            address: charityDataTwo.address,
            email: charityDataTwo.email,
        });

        charityKeys.forEach((key) => {
            expect(createdCharityTwo[key]).toEqual(charityDataTwo[key]);
        });
    });

    test('should get a charity by id', async () => {
        const getCharityTwo = await Charity.getCharityById(createdCharityTwo._id);

        charityKeys.forEach((key) => {
            expect(getCharityTwo[key]).toEqual(charityDataTwo[key]);
        });
    });

    test('should get many charities by id', async () => {
        const manyCharities = await Charity.getManyCharitiesById(
            [
                createdCharityTwo._id,
                createdCharityOne._id,
            ],
        );

        manyCharities.forEach((charity) => {
            const createdCharities = [createdCharityOne, createdCharityTwo];
            const charityMatch = createdCharities.find(
                (createdCharity) => createdCharity._id.equals(charity._id),
            );

            charityKeys.forEach((key) => {
                expect(charityMatch[key]).toEqual(charity[key]);
            });
        });
        expect(manyCharities).toHaveLength(2);
    });

    test('should get all charities', async () => {
        const allCharities = await Charity.getAllCharities();
        const charityIds = allCharities.map((charity) => charity._id);

        expect(allCharities).toHaveLength(2);
        expect(charityIds).toEqual(
            expect.arrayContaining([createdCharityTwo._id, createdCharityOne._id]),
        );
    });

    test('should update a charity by id', async () => {
        const updatedCharityTwo = await Charity.updateCharityById(
            createdCharityTwo._id,
            {
                email: 'new.email@test.com',
            },
        );

        charityKeys.forEach((key) => {
            if (key === 'email') {
                expect(updatedCharityTwo.email).toEqual('new.email@test.com');
            } else {
                expect(updatedCharityTwo[key]).toEqual(charityDataTwo[key]);
            }
        });
    });

    test('should delete a charity by id', async () => {
        await Charity.removeCharityById(createdCharityTwo._id);
        const allCharitiesAfterDelete = await Charity.getAllCharities();
        const charityIdsAfterDelete = allCharitiesAfterDelete.map(
            (charity) => charity._id,
        );

        expect(allCharitiesAfterDelete).toHaveLength(1);
        expect(charityIdsAfterDelete).not.toEqual(
            expect.arrayContaining([createdCharityTwo._id, createdCharityOne._id]),
        );
        expect(charityIdsAfterDelete).toEqual(
            expect.arrayContaining([createdCharityOne._id]),
        );
    });
});
