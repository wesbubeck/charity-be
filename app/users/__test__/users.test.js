/* eslint-disable no-underscore-dangle */

const mongoose = require('mongoose');
const User = require('../user-queries');

describe('Users', () => {
    let createdUserOne;
    let createdUserTwo;
    const userDataOne = {
        firstName: 'Dwight',
        lastName: 'Schrute',
        email: 'beet.farmer@dunder.com',
    };
    const userDataTwo = {
        firstName: 'Pam',
        lastName: 'Beasley',
        email: 'pamelamadingdong@dunder.com2',
    };

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

    test('should create a new user', async () => {
        createdUserOne = await User.createUser({
            firstName: userDataOne.firstName,
            lastName: userDataOne.lastName,
            email: userDataOne.email,
        });

        expect(createdUserOne.firstName).toEqual(userDataOne.firstName);
        expect(createdUserOne.email).toEqual(userDataOne.email);
        expect(createdUserOne.lastName).toEqual(userDataOne.lastName);
    });

    test('should create another new user', async () => {
        createdUserTwo = await User.createUser({
            firstName: userDataTwo.firstName,
            lastName: userDataTwo.lastName,
            email: userDataTwo.email,
        });

        expect(createdUserTwo.firstName).toEqual(userDataTwo.firstName);
        expect(createdUserTwo.email).toEqual(userDataTwo.email);
        expect(createdUserTwo.lastName).toEqual(userDataTwo.lastName);
    });

    test('should get a user by id', async () => {
        const getUserTwo = await User.getUserById(createdUserTwo._id);

        expect(getUserTwo.firstName).toEqual(userDataTwo.firstName);
        expect(getUserTwo.email).toEqual(userDataTwo.email);
        expect(getUserTwo.lastName).toEqual(userDataTwo.lastName);
    });

    test('should get all users', async () => {
        const allUsers = await User.getAllUsers();
        const userIds = allUsers.map((user) => user._id);

        expect(allUsers).toHaveLength(2);
        expect(userIds).toEqual(
            expect.arrayContaining([createdUserTwo._id, createdUserOne._id]),
        );
    });

    test('should update a user by id', async () => {
        const updatedUserTwo = await User.updateUserById(createdUserTwo._id, {
            email: 'new.email@test.com',
        });

        expect(updatedUserTwo.firstName).toEqual(userDataTwo.firstName);
        expect(updatedUserTwo.email).toEqual('new.email@test.com');
        expect(updatedUserTwo.lastName).toEqual(userDataTwo.lastName);
    });

    test('should delete a user by id', async () => {
        await User.removeUserById(createdUserTwo._id);
        const allUsersAfterDelete = await User.getAllUsers();
        const userIdsAfterDelete = allUsersAfterDelete.map((user) => user._id);

        expect(allUsersAfterDelete).toHaveLength(1);
        expect(userIdsAfterDelete).not.toEqual(
            expect.arrayContaining([createdUserTwo._id, createdUserOne._id]),
        );
        expect(userIdsAfterDelete).toEqual(
            expect.arrayContaining([createdUserOne._id]),
        );
    });
});
