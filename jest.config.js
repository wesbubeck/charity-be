module.exports = {
    preset: '@shelf/jest-mongodb',
    verbose: true,
    coverageThreshold: {
        global: {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100,

        },
    },
};
