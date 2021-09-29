const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const users = new Schema({
    firstname: {
        type: String,
        require: true
    },
    lastname: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
        unique: true
    }
});
const register = mongoose.model('users', users);
module.exports = register;