/* eslint-disable no-underscore-dangle */

const mongoose = require('mongoose');
const User = require('../user-queries');
const Event = require('../../events/event-queries');
const Charity = require('../../charities/charity-queries');

describe('Users', () => {
    let createdUserOne;
    let createdUserTwo;
    let createdEvent;
    let createdEventTwo;
    let createdCharity;
    const userUpdate = {};

    const userKeys = [
        'firstName',
        'lastName',
        'email',
    ];

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
    const charityDataOne = {
        address: '123 beet farm ave',
        email: 'nard.dog@dunder.com',
        charityName: 'Conn Casual Chaps',
    };

    const eventDataOne = {
        dateOfEvent: new Date('September 5, 2006 03:24:00'),
        eventContact: 'Schrute',
        address: '123 some street',
        eventDetails: 'This event is the finest beets',
        charityId: null,
        eventEmail: 'beet.farmer@dunder.com',
    };

    const eventDataTwo = {
        dateOfEvent: new Date('September 6, 2006 03:24:00'),
        eventContact: 'Nard Dog',
        address: '123 some other street',
        eventDetails: 'This event is connecticut caz',
        charityId: null,
        eventEmail: 'nardz@dunder.com',
    };

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        createdCharity = await Charity.createCharity({
            charityName: charityDataOne.charityName,
            address: charityDataOne.address,
            email: charityDataOne.email,
        });

        eventDataOne.charityId = [createdCharity._id];
        eventDataTwo.charityId = [createdCharity._id];
        userUpdate.charityId = [createdCharity._id];

        createdEventTwo = await Event.createEvent({
            dateOfEvent: eventDataOne.dateOfEvent,
            eventContact: eventDataOne.eventContact,
            eventEmail: eventDataOne.eventEmail,
            address: eventDataOne.address,
            charityId: eventDataOne.charityId,
            eventDetails: eventDataOne.eventDetails,
        });

        createdEvent = await Event.createEvent({
            dateOfEvent: eventDataTwo.dateOfEvent,
            eventContact: eventDataTwo.eventContact,
            eventEmail: eventDataTwo.eventEmail,
            address: eventDataTwo.address,
            charityId: eventDataTwo.charityId,
            eventDetails: eventDataTwo.eventDetails,
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

        userKeys.forEach((key) => {
            expect(createdUserOne[key]).toEqual(userDataOne[key]);
        });
    });

    test('should create another new user', async () => {
        createdUserTwo = await User.createUser({
            firstName: userDataTwo.firstName,
            lastName: userDataTwo.lastName,
            email: userDataTwo.email,
        });

        userKeys.forEach((key) => {
            expect(createdUserTwo[key]).toEqual(userDataTwo[key]);
        });
    });

    test('should get a user by id', async () => {
        const getUserTwo = await User.getUserById(createdUserTwo._id);

        userKeys.forEach((key) => {
            expect(getUserTwo[key]).toEqual(userDataTwo[key]);
        });
    });

    test('should get all users', async () => {
        const allUsers = await User.getAllUsers();
        const userIds = allUsers.map((user) => user._id);

        expect(allUsers).toHaveLength(2);
        expect(userIds).toEqual(
            expect.arrayContaining([createdUserTwo._id, createdUserOne._id]),
        );
    });

    test('should update a user by id with eventsAttendedIds/Favorited', async () => {
        const updatedUser = await User.updateUserById(createdUserTwo._id, {
            email: 'email@test.com',
            lastName: 'Scottsman',
            eventsFavoritedIds: [createdEvent._id, createdEventTwo._id],
            eventsAttendedIds: [createdEvent._id],
        });

        expect(updatedUser.firstName).toEqual(userDataTwo.firstName);
        expect(updatedUser.email).toEqual('email@test.com');
        expect(updatedUser.lastName).toEqual('Scottsman');
        expect(updatedUser.eventsAttendedIds).toEqual(
            expect.arrayContaining([createdEvent._id]),
        );
        expect(updatedUser.eventsFavoritedIds).toEqual(
            expect.arrayContaining([createdEvent._id, createdEventTwo._id]),
        );
        expect(updatedUser.eventsAttendedIds).toHaveLength(1);
        expect(updatedUser.eventsFavoritedIds).toHaveLength(2);
        expect(updatedUser.charitiesFavoritedIds).toHaveLength(0);
    });
    test('should update a user by id with eventsAttendedIds/Favorited and charities favorited and should create duplicate values', async () => {
        const updatedUser = await User.updateUserById(createdUserTwo._id, {
            lastName: 'ScottsmanTwo',
            eventsFavoritedIds: [
                createdEvent._id,
                createdEventTwo._id,
                createdEvent._id,
                createdEventTwo._id,
                createdEvent._id,
                createdEventTwo._id,
            ],
            eventsAttendedIds: [
                createdEvent._id,
                createdEvent._id,
                createdEvent._id,
            ],
            charitiesFavoritedIds: [
                createdCharity._id,
                createdCharity._id,
            ],
        });

        expect(updatedUser.lastName).toEqual('ScottsmanTwo');
        expect(updatedUser.eventsAttendedIds).toEqual(
            expect.arrayContaining([createdEvent._id]),
        );
        expect(updatedUser.eventsFavoritedIds).toEqual(
            expect.arrayContaining([createdEvent._id, createdEventTwo._id]),
        );
        expect(updatedUser.charitiesFavoritedIds).toEqual(
            expect.arrayContaining([createdCharity._id]),
        );
        expect(updatedUser.eventsAttendedIds).toHaveLength(1);
        expect(updatedUser.eventsFavoritedIds).toHaveLength(2);
        expect(updatedUser.charitiesFavoritedIds).toHaveLength(1);
    });
    test('should update a user by id', async () => {
        const updatedUser = await User.updateUserById(createdUserTwo._id, {
            email: 'emailThree@test.com',
            lastName: 'ScottsmanThree',
        });

        expect(updatedUser.firstName).toEqual(userDataTwo.firstName);
        expect(updatedUser.email).toEqual('emailThree@test.com');
        expect(updatedUser.lastName).toEqual('ScottsmanThree');
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

describe('getPushValue', () => {
    test('should return an object that includes fields with array length greater than 0', () => {
        expect(User.getPushValues(
            [],
            [],
            ['id1'],
        )).toEqual({
            charitiesFavoritedIds: ['id1'],
        });
        expect(User.getPushValues(
            [],
            ['id2'],
            [],
        )).toEqual({
            eventsFavoritedIds: ['id2'],
        });
        expect(User.getPushValues(
            ['id3'],
            [],
            [],
        )).toEqual({
            eventsAttendedIds: ['id3'],
        });
        expect(User.getPushValues(
            ['id3'],
            ['id2'],
            ['id1'],
        )).toEqual({
            eventsAttendedIds: ['id3'],
            eventsFavoritedIds: ['id2'],
            charitiesFavoritedIds: ['id1'],
        });
    });
});
