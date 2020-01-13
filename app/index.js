const express = require('express');
const morgan = require('morgan');
const { json, urlencoded } = require('body-parser');
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');
const connect = require('../connect');

const app = express();
const User = require('./users/user-queries');
const Charity = require('./charities/charity-queries');
const Event = require('./events/event-queries');

// Some fake data
const books = [
    {
        title: "Harry Potter and the Sorcerer's stone",
        author: 'J.K. Rowling',
    },
    {
        title: 'Jurassic Park',
        author: 'Michael Crichton',
    },
];

// The GraphQL schema in string form
const typeDefs = `
  type Query { books: [Book] }
  type Book { title: String, author: String }
`;

// The resolvers
const resolvers = {
    Query: { books: () => books },
};

// Put together a schema
const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

app.use(morgan('dev'));
app.use(urlencoded({ extended: true }));

// The GraphQL endpoint
app.use('/graphql', json(), graphqlExpress({ schema }));

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

app.get('/charity/:id', async (req, res) => {
    const charityId = req.params.id;
    const charity = await Charity.getCharityById(charityId);
    res.status(200).json(charity);
});

app.get('/charities', async (req, res) => {
    const charity = await Charity.getAllCharities();
    res.status(200).json(charity);
});

app.post('/charity', async (req, res) => {
    const charityToCreate = req.body.charity;
    const charity = await Charity.createCharity(charityToCreate);
    res.status(201).json(charity.toJSON());
});

app.get('/event/:id', async (req, res) => {
    const eventId = req.params.id;
    const event = await Event.getEventById(eventId);
    res.status(200).json(event);
});

app.get('/events', async (req, res) => {
    const event = await Event.getAllEvents();
    res.status(200).json(event);
});

app.post('/event', async (req, res) => {
    const eventToCreate = req.body.event;
    const event = await Event.createEvent(eventToCreate);
    res.status(201).json(event.toJSON());
});

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    const user = await User.getUserById(userId);
    res.status(200).json(user);
});

app.post('/user', async (req, res) => {
    const userToCreate = req.body.user;
    const user = await User.createUser(userToCreate);
    res.status(201).json(user.toJSON());
});

app.get('/users', async (req, res) => {
    const user = await User.getAllUsers();
    res.status(200).json(user);
});

connect('mongodb://localhost:27017/soulFoodDB')
    .then(() => app.listen(4040, () => {
        /* eslint-disable no-console */
        console.log('server on http://localhost:4040');
    }))
    .catch((e) => console.error(e));
/* eslint-disable no-console */
