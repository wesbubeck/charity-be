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
    eventEmail: 'beet.farmer@dunder.com'
  };
  const eventDataTwo = {
    dateOfEvent: new Date('August 28, 2015 03:24:00'),
    eventContact: 'Beasley',
    address: '888 some avenue',
    eventDetails: 'This is an art show for the peeps',
    charity: null,
    eventEmail: 'pamelamadingdong@dunder.com2'
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const address = '134 dunder way';
    const email = 'm.scott@dunder.com2';
    const charityName = 'Scotts tots';

    createdCharity = await Charity.createCharity({
      email,
      address,
      charityName
    });
    eventDataOne.charity = createdCharity._id;
    eventDataTwo.charity = createdCharity._id;
  });

  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async collection => {
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
      eventDetails: eventDataOne.eventDetails
    });

    expect(createdEventOne.dateOfEvent).toEqual(eventDataOne.dateOfEvent);
    expect(createdEventOne.eventEmail).toEqual(eventDataOne.eventEmail);
    expect(createdEventOne.eventContact).toEqual(eventDataOne.eventContact);
    expect(createdEventOne.address).toEqual(eventDataOne.address);
    expect(createdEventOne.charity).toEqual(eventDataOne.charity);
    expect(createdEventOne.eventDetails).toEqual(eventDataOne.eventDetails);
  });

  test('should create another new event', async () => {
    createdEventTwo = await Event.createEvent({
      dateOfEvent: eventDataTwo.dateOfEvent,
      eventContact: eventDataTwo.eventContact,
      eventEmail: eventDataTwo.eventEmail,
      address: eventDataTwo.address,
      charity: eventDataTwo.charity,
      eventDetails: eventDataTwo.eventDetails
    });

    expect(createdEventTwo.dateOfEvent).toEqual(eventDataTwo.dateOfEvent);
    expect(createdEventTwo.eventEmail).toEqual(eventDataTwo.eventEmail);
    expect(createdEventTwo.eventContact).toEqual(eventDataTwo.eventContact);
    expect(createdEventTwo.address).toEqual(eventDataTwo.address);
    expect(createdEventTwo.charity).toEqual(eventDataTwo.charity);
    expect(createdEventTwo.eventDetails).toEqual(eventDataTwo.eventDetails);
  });

  test('should get a event by id', async () => {
    const getEventTwo = await Event.getEventById(createdEventTwo._id);

    expect(getEventTwo.dateOfEvent).toEqual(eventDataTwo.dateOfEvent);
    expect(getEventTwo.eventEmail).toEqual(eventDataTwo.eventEmail);
    expect(getEventTwo.eventContact).toEqual(eventDataTwo.eventContact);
    expect(getEventTwo.address).toEqual(eventDataTwo.address);
    expect(getEventTwo.charity).toEqual(eventDataTwo.charity);
    expect(getEventTwo.eventDetails).toEqual(eventDataTwo.eventDetails);
  });

  test('charity should contain a ref to the events it is mapped to', async () => {
    const charityWithEvent = await Charity.getCharityById(createdCharity._id);

    expect(charityWithEvent.events).toEqual(
      expect.arrayContaining([createdEventTwo._id, createdEventOne._id])
    );
  });

  test('should get all events', async () => {
    const allEvents = await Event.getAllEvents();
    const eventIds = allEvents.map(event => event._id);

    expect(allEvents).toHaveLength(2);
    expect(eventIds).toEqual(
      expect.arrayContaining([createdEventTwo._id, createdEventOne._id])
    );
  });

  test('should update a event by id', async () => {
    const updatedEventTwo = await Event.updateEventById(createdEventTwo._id, {
      eventEmail: 'new.eventEmail@test.com'
    });

    expect(updatedEventTwo.dateOfEvent).toEqual(eventDataTwo.dateOfEvent);
    expect(updatedEventTwo.eventEmail).toEqual('new.eventEmail@test.com');
    expect(updatedEventTwo.eventContact).toEqual(eventDataTwo.eventContact);
    expect(updatedEventTwo.address).toEqual(eventDataTwo.address);
    expect(updatedEventTwo.charity).toEqual(eventDataTwo.charity);
    expect(updatedEventTwo.eventDetails).toEqual(eventDataTwo.eventDetails);
  });

  test('should delete a event by id', async () => {
    await Event.removeEventById(createdEventTwo._id);
    const allEventsAfterDelete = await Event.getAllEvents();
    const eventIdsAfterDelete = allEventsAfterDelete.map(event => event._id);

    expect(allEventsAfterDelete).toHaveLength(1);
    expect(eventIdsAfterDelete).not.toEqual(
      expect.arrayContaining([createdEventTwo._id, createdEventOne._id])
    );
    expect(eventIdsAfterDelete).toEqual(
      expect.arrayContaining([createdEventOne._id])
    );
  });
});
