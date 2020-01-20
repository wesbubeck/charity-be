module.exports = {
    Query: {
        // from documentation: `fieldName: (parent, args, context, info) => data;`
        // Example graphql queries:
        // {
        //     events {
        //     eventContact
        //     address
        //     charity
        //     eventDetails
        //   }
        // }
        // **********************
        // {
        //      event(id: "5e0ac7518119062d361ddc83") {
        //          eventDetails
        //          eventContact
        //      }
        // }
        // Example graphql mutations:
        // mutation {
        //     createEvent(input:{
        //           dateOfEvent: "Friday, September 18, 2020 7:00:00 PM"
        //           eventContact: "Angela Smirnoff"
        //           address: "1st ave New York, New York"
        //           eventEmail: "angela@email.io"
        //           eventDetails: "This is an event created with graphql"
        //           charity: "5e08fe0c1623cb085602857b"
        //     }){
        //       eventDetails (this is fields returned)
        //     }
        //   }
        // **********************
        // mutation {
        //     updateEvent(
        //       id: "5e250f1ba3f427985ff85c84",
        //       input:{
        //           dateOfEvent: "Thursday, September 17, 2020 7:00:00 PM"
        //           eventContact: "Angela Smirnoff"
        //           address: "1st ave New York, New York"
        //           eventEmail: "angela@email.io"
        //           eventDetails: "This is an event created with graphql"
        //           charity: "5e08fe0c1623cb085602857b"
        //     }){
        //       eventDetails
        //     }
        //   }
        // **********************
        // mutation {
        //     deleteEvent(id: "5e0ac8862ceb952d50309483"){
        //       eventDetails
        //       eventContact
        //     }
        //   }
        events: (_, __, { dataSources }) => dataSources.eventApi.getAllEvents(),
        event: (_, { id }, { dataSources }) => dataSources.eventApi.getEventById(id),
        users: (_, __, { dataSources }) => dataSources.userApi.getAllUsers(),
        user: (_, { id }, { dataSources }) => dataSources.userApi.getUserById(id),
        charities: (_, __, { dataSources }) => dataSources.charityApi.getAllCharities(),
        charity: (_, { id }, { dataSources }) => dataSources.charityApi.getCharityById(id),
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
};
