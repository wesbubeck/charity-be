/* eslint-disable no-underscore-dangle */

const mongoose = require('mongoose');
const Event = require('../event-queries');
const Charity = require('../../charities/charity-queries');

describe('Events', () => {
    let createdEventOne;
    let createdEventTwo;
    let createdCharity;
    const eventDataOne = {
        dateOfEvent: new Date('September 5, 2006 03:24:00'),
        eventContact: 'Schrute',
        address: '123 some street',
        eventDetails: 'This event is the finest beets',
        charity: null,
        eventEmail: 'beet.farmer@dunder.com',
    };
    const eventDataTwo = {
        dateOfEvent: new Date('August 28, 2015 03:24:00'),
        eventContact: 'Beasley',
        address: '888 some avenue',
        eventDetails: 'This is an art show for the peeps',
        charity: null,
        eventEmail: 'pamelamadingdong@dunder.com2',
    };

    const eventKeys = [
        'dateOfEvent',
        'eventEmail',
        'eventContact',
        'address',
        'charity',
        'eventDetails',
    ];

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        const address = '134 dunder way';
        const email = 'm.scott@dunder.com2';
        const charityName = 'Scotts tots';

        createdCharity = await Charity.createCharity({
            email,
            address,
            charityName,
        });
        eventDataOne.charity = createdCharity._id;
        eventDataTwo.charity = createdCharity._id;
    });

    afterAll(async () => {
        const collections = await mongoose.connection.db.collections();

        collections.forEach(async (collection) => {
            await collection.remove();
        });
        await mongoose.connection.close();
    });

    test('should create a new event', async () => {
        createdEventOne = await Event.createEvent({
            dateOfEvent: eventDataOne.dateOfEvent,
            eventContact: eventDataOne.eventContact,
            eventEmail: eventDataOne.eventEmail,
            address: eventDataOne.address,
            charity: eventDataOne.charity,
            eventDetails: eventDataOne.eventDetails,
        });

        eventKeys.forEach((key) => {
            expect(createdEventOne[key]).toEqual(eventDataOne[key]);
        });
    });

    test('should create another new event', async () => {
        createdEventTwo = await Event.createEvent({
            dateOfEvent: eventDataTwo.dateOfEvent,
            eventContact: eventDataTwo.eventContact,
            eventEmail: eventDataTwo.eventEmail,
            address: eventDataTwo.address,
            charity: eventDataTwo.charity,
            eventDetails: eventDataTwo.eventDetails,
        });

        eventKeys.forEach((key) => {
            expect(createdEventTwo[key]).toEqual(eventDataTwo[key]);
        });
    });

    test('should get a event by id', async () => {
        const getEventTwo = await Event.getEventById(createdEventTwo._id);

        eventKeys.forEach((key) => {
            expect(getEventTwo[key]).toEqual(eventDataTwo[key]);
        });
    });
    test('should get many events by id', async () => {
        const manyEvents = await Event.getManyEventsById(
            [
                createdEventTwo._id,
                createdEventOne._id,
            ],
        );

        manyEvents.forEach((event) => {
            const createdEvents = [createdEventOne, createdEventTwo];
            const eventMatch = createdEvents.find(
                (createdEvent) => createdEvent._id.equals(event._id),
            );

            eventKeys.forEach((key) => {
                expect(eventMatch[key]).toEqual(event[key]);
            });
        });
        expect(manyEvents).toHaveLength(2);
    });

    test('charity should contain a ref to the events it is mapped to', async () => {
        const charityWithEvent = await Charity.getCharityById(createdCharity._id);

        expect(charityWithEvent.events).toEqual(
            expect.arrayContaining([createdEventTwo._id, createdEventOne._id]),
        );
    });

    test('should get all events', async () => {
        const allEvents = await Event.getAllEvents();
        const eventIds = allEvents.map((event) => event._id);

        expect(allEvents).toHaveLength(2);
        expect(eventIds).toEqual(
            expect.arrayContaining([createdEventTwo._id, createdEventOne._id]),
        );
    });

    test('should update a event by id', async () => {
        const updatedEventTwo = await Event.updateEventById(createdEventTwo._id, {
            eventEmail: 'new.eventEmail@test.com',
        });

        eventKeys.forEach((key) => {
            if (key !== 'eventEmail') {
                expect(updatedEventTwo[key]).toEqual(eventDataTwo[key]);
            } else {
                expect(updatedEventTwo.eventEmail).toEqual('new.eventEmail@test.com');
            }
        });
    });

    test('should delete a event by id', async () => {
        await Event.removeEventById(createdEventTwo._id);
        const allEventsAfterDelete = await Event.getAllEvents();
        const eventIdsAfterDelete = allEventsAfterDelete.map((event) => event._id);

        expect(allEventsAfterDelete).toHaveLength(1);
        expect(eventIdsAfterDelete).not.toEqual(
            expect.arrayContaining([createdEventTwo._id, createdEventOne._id]),
        );
        expect(eventIdsAfterDelete).toEqual(
            expect.arrayContaining([createdEventOne._id]),
        );
    });
});
