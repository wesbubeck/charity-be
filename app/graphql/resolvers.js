module.exports = {
    Query: {
        events: (_, __, { dataSources }) => dataSources.eventApi.getAllEvents(),
        event: (_, { id }, { dataSources }) => dataSources.eventApi.getEventById(id),
        users: (_, __, { dataSources }) => dataSources.userApi.getAllUsers(),
        user: (_, { id }, { dataSources }) => dataSources.userApi.getUserById(id),
        charities: (_, __, { dataSources }) => dataSources.charityApi.getAllCharities(),
        charity: (_, { id }, { dataSources }) => dataSources.charityApi.getCharityById(id),
        address: (_, { input }, { dataSources }) => dataSources.addressApi.getAddress(input),
    },
    Mutation: {
        createEvent: (_, { input }, { dataSources }) => {
            const newEvent = Object.assign(input, { dateOfEvent: new Date(input.dateOfEvent) });
            return dataSources.eventApi.createEvent(newEvent);
        },
        updateEvent: (_, { input, id }, { dataSources }) => {
            const eventUpdate = Object.assign(input, { dateOfEvent: new Date(input.dateOfEvent) });
            return dataSources.eventApi.updateEventById(
                id,
                eventUpdate,
            );
        },
        deleteEvent: (_, { id }, { dataSources }) => dataSources.eventApi.removeEventById(id),
        createUser: (_, { input }, { dataSources }) => dataSources.userApi.createUser(input),
        updateUser: (_, { input, id }, { dataSources }) => dataSources.userApi.updateUserById(
            id,
            input,
        ),
        deleteUser: (_, { id }, { dataSources }) => dataSources.userApi.removeUserById(id),
        createCharity: (
            _,
            { input },
            { dataSources },
        ) => dataSources.charityApi.createCharity(input),
        updateCharity: (
            _,
            { input, id },
            { dataSources },
        ) => dataSources.charityApi.updateCharityById(
            id,
            input,
        ),
        deleteCharity: (_, { id }, { dataSources }) => dataSources.charityApi.removeCharityById(id),
    },
    User: {
        fullEventsAttended: (
            user,
            _,
            { dataSources },
        ) => dataSources.eventApi.getManyEventsById(user.eventsAttended),
        fullEventsFavorited: (
            user,
            _,
            { dataSources },
        ) => dataSources.eventApi.getManyEventsById(user.eventsFavorited),
        fullCharitiesFavorited: (
            user,
            _,
            { dataSources },
        ) => dataSources.charityApi.getManyCharitiesById(user.charitiesFavorited),
    },
    Event: {
        fullCharity: (
            event,
            _,
            { dataSources },
        ) => dataSources.charityApi.getCharityById(event.charity),
    },
};
