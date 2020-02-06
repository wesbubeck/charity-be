/* eslint-disable no-underscore-dangle */
const {
    Query,
    Mutation,
    User,
} = require('../resolvers');

const mockEvents = [
    {
        _id: '123abcWTB',
        dateOfEvent: '2020-09-17T23:00:00.000+00:00',
        eventContact: 'Ben Franklin',
        address: '111 penn way Philadelphia, PA',
        eventEmail: 'kiteman@email.com',
        eventDetails: 'We are flying kites rain or shine',
        charity: '456defJTB',
    },
    {
        _id: '789abcWTB',
        dateOfEvent: '2020-09-18T23:00:00.000+00:00',
        eventContact: 'Rocky B',
        address: 'The gym',
        eventEmail: 'italianstallion@email.com',
        eventDetails: 'Punching Beef',
        charity: '123abcJTB',
    },
];

const mockCharities = [
    {
        _id: '123abcLRB',
        charityName: 'Charity 1',
        address: '111 USA',
        email: 'charityone@email.com',
        events: ['123abcWTB'],
    },
    {
        _id: '456defJTB',
        charityName: 'Charity 2',
        address: '222 USA',
        email: 'charitytwo@email.com',
        events: ['789abcWTB'],
    },
];

const mockUsers = [
    {
        _id: '123fooHRB',
        firstName: 'Lenny',
        lastName: 'Dykstra',
        email: 'juice@email.com',
        eventsAttended: ['123abcWTB'],
        eventsFavorited: ['123abcWTB', '789abcWTB'],
        charitiesFavorited: ['456defJTB'],
    },
    {
        _id: '456fooHRB',
        firstName: 'Julius',
        lastName: 'Irving',
        email: 'drj@email.com',
    },
];

const mockAddress = {
    address: {
        location: {
            lat: '26.9747691',
            lng: '-80.1108622',
        },
        formattedAddress: '111 SE River Side Rd, Tequesta, FL 33469, USA',
        placeId: 'ChIJqU2XSc7X3ogbdbd9l9Fc0',
    },
};

const mockDataSources = {
    dataSources: {
        eventApi: {
            getAllEvents: () => mockEvents,
            getEventById: (id) => mockEvents.find((event) => event._id === id),
            getManyEventsById: (
                ids,
            ) => ids.map((id) => mockDataSources.dataSources.eventApi.getEventById(id)),
            createEvent: (event) => event,
            updateEventById: (id, eventUpdates) => {
                const eventToUpdate = mockEvents.find((event) => event._id === id);
                return Object.assign(eventToUpdate, eventUpdates);
            },
            removeEventById: (id) => mockEvents.find((event) => event._id === id),
        },
        userApi: {
            getAllUsers: () => mockUsers,
            getUserById: (id) => mockUsers.find((user) => user._id === id),
            createUser: (user) => user,
            updateUserById: (id, userUpdates) => {
                const userToUpdate = mockUsers.find((user) => user._id === id);
                return Object.assign(userToUpdate, userUpdates);
            },
            removeUserById: (id) => mockUsers.find((user) => user._id === id),
        },
        charityApi: {
            getAllCharities: () => mockCharities,
            getCharityById: (id) => mockCharities.find((charity) => charity._id === id),
            getManyCharitiesById: (
                ids,
            ) => ids.map((id) => mockDataSources.dataSources.charityApi.getCharityById(id)),
            createCharity: (charity) => charity,
            updateCharityById: (id, charityUpdates) => {
                const charityToUpdate = mockCharities.find((charity) => charity._id === id);
                return Object.assign(charityToUpdate, charityUpdates);
            },
            removeCharityById: (id) => mockCharities.find((charity) => charity._id === id),
        },
        addressApi: {
            getAddress: () => mockAddress,
        },
    },
};

describe('Queries', () => {
    describe('event', () => {
        it('should get event by id', () => {
            const eventById = Query.event(null, { id: '123abcWTB' }, mockDataSources);
            const mockEvent = mockEvents.find((event) => event._id === '123abcWTB');
            expect(eventById).toEqual(mockEvent);
        });
    });
    describe('events', () => {
        it('it should get all events', () => {
            const allEvents = Query.events(null, null, mockDataSources);
            expect(allEvents).toEqual(mockEvents);
        });
    });
    describe('user', () => {
        it('should get user by id', () => {
            const userById = Query.user(null, { id: '123fooHRB' }, mockDataSources);
            const mockUser = mockUsers.find((user) => user._id === '123fooHRB');
            expect(userById).toEqual(mockUser);
        });
    });
    describe('users', () => {
        it('it should get all users', () => {
            const allUsers = Query.users(null, null, mockDataSources);
            expect(allUsers).toEqual(mockUsers);
        });
    });
    describe('charity', () => {
        it('should get charity by id', () => {
            const charityById = Query.charity(null, { id: '123abcLRB' }, mockDataSources);
            const mockCharity = mockCharities.find((charity) => charity._id === '123abcLRB');
            expect(charityById).toEqual(mockCharity);
        });
    });
    describe('charities', () => {
        it('should get all charities', () => {
            const allCharities = Query.charities(null, null, mockDataSources);
            expect(allCharities).toEqual(mockCharities);
        });
    });
    describe('address', () => {
        it('should get an address', () => {
            const address = Query.address(null, { street: '111 1st', city: 'Scranton', state: 'PA' }, mockDataSources);
            expect(address).toEqual(mockAddress);
        });
    });
});

describe('Mutations', () => {
    describe('createEvent', () => {
        it('should create an event', () => {
            const createdEvent = Mutation.createEvent(
                null,
                { input: mockEvents[0] },
                mockDataSources,
            );
            expect(createdEvent).toEqual(mockEvents[0]);
        });
    });
    describe('updateEvent', () => {
        it('should update and event', () => {
            const update = { eventDetails: 'Updated: We are flying kites rain or shine' };
            const updatedEvent = Mutation.updateEvent(
                null,
                { input: update, id: mockEvents[0]._id },
                mockDataSources,
            );
            const mockEventUpdated = mockEvents.find((event) => event._id === mockEvents[0]._id);

            expect(updatedEvent.eventDetails).toEqual(update.eventDetails);
            expect(updatedEvent).toEqual(mockEventUpdated);
        });
    });
    describe('deleteEvent', () => {
        it('should delete an event', () => {
            const deletedEvent = Mutation.deleteEvent(
                null,
                { id: mockEvents[0]._id },
                mockDataSources,
            );
            const mockDeletedEvent = mockEvents.find((event) => event._id === mockEvents[0]._id);
            expect(mockDeletedEvent).toEqual(deletedEvent);
        });
    });
    describe('createUser', () => {
        it('should create an user', () => {
            const createdUser = Mutation.createUser(null, { input: mockUsers[0] }, mockDataSources);
            expect(createdUser).toEqual(mockUsers[0]);
        });
    });
    describe('updateUser', () => {
        it('should update an user', () => {
            const update = { firstName: 'Updated: Lenny' };
            const updatedUser = Mutation.updateUser(
                null,
                { input: update, id: mockUsers[0]._id },
                mockDataSources,
            );
            const mockUserUpdated = mockUsers.find((user) => user._id === mockUsers[0]._id);

            expect(updatedUser.firstName).toEqual(update.firstName);
            expect(updatedUser).toEqual(mockUserUpdated);
        });
    });
    describe('deleteUser', () => {
        it('Should update an user', () => {
            const deletedUser = Mutation.deleteUser(
                null,
                { id: mockUsers[0]._id },
                mockDataSources,
            );
            const mockDeletedUser = mockUsers.find((event) => event._id === mockUsers[0]._id);
            expect(mockDeletedUser).toEqual(deletedUser);
        });
    });
    describe('createCharity', () => {
        it('should create a charity', () => {
            const createdCharity = Mutation.createCharity(
                null,
                { input: mockCharities[0] },
                mockDataSources,
            );
            expect(createdCharity).toEqual(mockCharities[0]);
        });
    });
    describe('updateCharity', () => {
        it('should update a charity', () => {
            const update = { charityName: 'Updated: Charity 1' };
            const updatedCharity = Mutation.updateCharity(
                null,
                { input: update, id: mockCharities[0]._id },
                mockDataSources,
            );
            const mockCharityUpdated = mockCharities.find(
                (user) => user._id === mockCharities[0]._id,
            );

            expect(updatedCharity.charityName).toEqual(update.charityName);
            expect(updatedCharity).toEqual(mockCharityUpdated);
        });
    });
    describe('deleteCharity', () => {
        it('should delete a charity', () => {
            const deletedCharity = Mutation.deleteCharity(
                null,
                { id: mockCharities[0]._id },
                mockDataSources,
            );
            const mockDeletedCharity = mockCharities.find(
                (event) => event._id === mockCharities[0]._id,
            );
            expect(mockDeletedCharity).toEqual(deletedCharity);
        });
    });
});

describe('User', () => {
    const userOne = mockDataSources.dataSources.userApi.getUserById('123fooHRB');
    describe('fullEventsAttended', () => {
        it('should return the events that match the passed in ids', () => {
            const userOneFullEventsAttended = User.fullEventsAttended(
                userOne,
                undefined,
                mockDataSources,
            );
            expect(userOneFullEventsAttended).toHaveLength(userOne.eventsAttended.length);
            userOneFullEventsAttended.forEach((event) => {
                const eventMatch = mockEvents.find(
                    (mockEvent) => event._id === mockEvent._id,
                );
                expect(eventMatch).toEqual(event);
            });
        });
    });
    describe('fullEventsFavorited', () => {
        it('should return the events that match the passed in ids', () => {
            const userOneFullEventsFavorited = User.fullEventsFavorited(
                userOne,
                undefined,
                mockDataSources,
            );
            expect(userOneFullEventsFavorited).toHaveLength(userOne.eventsFavorited.length);
            userOneFullEventsFavorited.forEach((event) => {
                const eventMatch = mockEvents.find(
                    (mockEvent) => event._id === mockEvent._id,
                );
                expect(eventMatch).toEqual(event);
            });
        });
    });
    describe('fullCharitiesFavorited', () => {
        it('should return the events that match the passed in ids', () => {
            const userOneFullCharitiesFavorited = User.fullCharitiesFavorited(
                userOne,
                undefined,
                mockDataSources,
            );
            expect(userOneFullCharitiesFavorited).toHaveLength(userOne.charitiesFavorited.length);
            userOneFullCharitiesFavorited.forEach((charity) => {
                const charityMatch = mockCharities.find(
                    (mockCharity) => charity._id === mockCharity._id,
                );
                expect(charityMatch).toEqual(charity);
            });
        });
    });
});
