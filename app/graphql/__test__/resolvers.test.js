/* eslint-disable no-underscore-dangle */
const {
    Query,
    Mutation
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
    },
    {
        _id: '456fooHRB',
        firstName: 'Julius',
        lastName: 'Irving',
        email: 'drj@email.com',
    },
];

const mockDataSources = {
    dataSources: {
        eventApi: {
            getAllEvents: () => mockEvents,
            getEventById: (id) => mockEvents.find((event) => event._id === id),
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
            createCharity: (charity) => charity,
            updateCharityById: (id, charityUpdates) => {
                const charityToUpdate = mockCharities.find((charity) => charity._id === id);
                return Object.assign(charityToUpdate, charityUpdates);
            },
            removeCharityById: (id) => mockCharities.find((charity) => charity._id === id),
        },
    },
};

describe('Queries', () => {
    describe('event', () => {
        it('should get event by id', () => {
            const eventById = Query.event(null, { id: '123abcLRB' }, mockDataSources);
            const mockEvent = mockEvents.find((event) => event._id === '123abcLRB');
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
        const allCharities = Query.charities(null, null, mockDataSources);
        expect(allCharities).toEqual(mockCharities);
    });
});
