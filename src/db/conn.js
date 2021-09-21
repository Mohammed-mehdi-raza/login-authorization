const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/registrations', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('connection to database successful');
}).catch((e) => {
    console.log(`not connected due to error ${e}`);
});