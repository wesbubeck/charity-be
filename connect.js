const mongoose = require('mongoose');

const connect = (url) => mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = connect;
