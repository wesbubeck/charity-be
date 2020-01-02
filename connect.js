const mongoose = require('mongoose');

const connect = url => {
    return mongoose.connect(url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = connect