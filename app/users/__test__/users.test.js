/* eslint-disable no-underscore-dangle */

const mongoose = require('mongoose');
const User = require('../user-queries');
const Event = require('../../events/event-queries');
const Charity = require('../../charities/charity-queries');
describe('Users', () => {
  let createdUserOne;
  let createdUserTwo;
  let createdEvent;
  let createdCharity;
  let userUpdate = {};

  const userDataOne = {
    firstName: 'Dwight',
    lastName: 'Schrute',
    email: 'beet.farmer@dunder.com'
  };
  const userDataTwo = {
    firstName: 'Pam',
    lastName: 'Beasley',
    email: 'pamelamadingdong@dunder.com2'
  };
  const charityDataOne = {
    address: '123 beet farm ave',
    email: 'nard.dog@dunder.com',
    charityName: 'Conn Casual Chaps'
  };

  let eventDataOne = {
    dateOfEvent: new Date('September 5, 2006 03:24:00'),
    eventContact: 'Schrute',
    address: '123 some street',
    eventDetails: 'This event is the finest beets',
    charity: null,
    eventEmail: 'beet.farmer@dunder.com'
  };

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    createdCharity = await Charity.createCharity({
      charityName: charityDataOne.charityName,
      address: charityDataOne.address,
      email: charityDataOne.email
    });

    eventDataOne.charity = [createdCharity._id];
    userUpdate.charity = [createdCharity._id];

    createdEvent = await Event.createEvent({
      dateOfEvent: eventDataOne.dateOfEvent,
      eventContact: eventDataOne.eventContact,
      eventEmail: eventDataOne.eventEmail,
      address: eventDataOne.address,
      charity: eventDataOne.charity,
      eventDetails: eventDataOne.eventDetails
    });
    userUpdate.event = [createdEvent._id];
  });

  afterAll(async () => {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(async collection => {
      await collection.remove();
    });

    await mongoose.connection.close();
  });

  test('should create a new user', async () => {
    createdUserOne = await User.createUser({
      firstName: userDataOne.firstName,
      lastName: userDataOne.lastName,
      email: userDataOne.email
    });

    expect(createdUserOne.firstName).toEqual(userDataOne.firstName);
    expect(createdUserOne.email).toEqual(userDataOne.email);
    expect(createdUserOne.lastName).toEqual(userDataOne.lastName);
  });

  test('should create another new user', async () => {
    createdUserTwo = await User.createUser({
      firstName: userDataTwo.firstName,
      lastName: userDataTwo.lastName,
      email: userDataTwo.email
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
    const userIds = allUsers.map(user => user._id);

    expect(allUsers).toHaveLength(2);
    expect(userIds).toEqual(
      expect.arrayContaining([createdUserTwo._id, createdUserOne._id])
    );
  });

  test('should update a user by id', async () => {
    const updatedUserTwo = await User.updateUserById(createdUserTwo._id, {
      email: 'email@test.com',
      lastName: 'Scottsman',
      eventsFavorited: userUpdate.event,
      eventsAttended: userUpdate.event,
      charitiesFavorited: userUpdate.charity
    });

    expect(updatedUserTwo.firstName).toEqual(userDataTwo.firstName);
    expect(updatedUserTwo.email).toEqual('email@test.com');
    expect(updatedUserTwo.lastName).toEqual('Scottsman');
    expect(updatedUserTwo.eventsAttended[0]).toEqual(userUpdate.event[0]);
    expect(updatedUserTwo.eventsFavorited[0]).toEqual(userUpdate.event[0]);
    expect(updatedUserTwo.charitiesFavorited[0]).toEqual(userUpdate.charity[0]);
  });
  test('should update a user by id', async () => {
    const updatedUserTwo = await User.updateUserById(createdUserTwo._id, {
      email: 'email@test.com',
      lastName: 'Scottsman'
    });

    expect(updatedUserTwo.firstName).toEqual(userDataTwo.firstName);
    expect(updatedUserTwo.email).toEqual('email@test.com');
    expect(updatedUserTwo.lastName).toEqual('Scottsman');
  });
  test('gets the correct array values to add events/charities like/attended', () => {
    expect(User.getPushValues([], [], ['foobar'])).toEqual({
      charitiesFavorited: { $each: ['foobar'] },
      eventsFavorited: null,
      eventsAttended: null
    });
    expect(User.getPushValues([], ['foobar'], [])).toEqual({
      charitiesFavorited: null,
      eventsFavorited: { $each: ['foobar'] },
      eventsAttended: null
    });
  });
  test('should delete a user by id', async () => {
    await User.removeUserById(createdUserTwo._id);
    const allUsersAfterDelete = await User.getAllUsers();
    const userIdsAfterDelete = allUsersAfterDelete.map(user => user._id);

    expect(allUsersAfterDelete).toHaveLength(1);
    expect(userIdsAfterDelete).not.toEqual(
      expect.arrayContaining([createdUserTwo._id, createdUserOne._id])
    );
    expect(userIdsAfterDelete).toEqual(
      expect.arrayContaining([createdUserOne._id])
    );
  });
});
