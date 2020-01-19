module.exports = {
    Query: {
        // from documentation: `fieldName: (parent, args, context, info) => data;`
        events: (_, __, { eventApi }) => eventApi.getAllEvents(),
    },
};
