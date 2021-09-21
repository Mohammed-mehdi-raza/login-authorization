const register = require('../models/register.js');
const bcrypt = require('bcryptjs');

const signup = (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password == cpassword) {
            const user = new register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                username: req.body.username,
                password: req.body.password
            });
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(`error in generating salt: ${err}`);
                } else {
                    bcrypt.hash(user.password, salt, async(error, hash) => {
                        if (error) {
                            console.log(`error in hashing password: ${error}`);
                        } else {
                            user.password = hash;
                            const result = await user.save();
                            console.log(result);
                            res.send("success");
                        }
                    });
                }
            });

        } else {
            res.send('password does not match');
        }
    } catch (error) {
        console.log(error);
    }
};

const log = async(req, res) => {
    try {
        const name = req.body.username;
        const pass = req.body.password;
        const newu = await register.findOne({
            username: name
        });
        bcrypt.compare(pass, newu.password, (err, result) => {
            if (err) {
                console.log(`error in comparng bcrypt: ${err}`);
            } else if (result) {
                res.send(newu);
            } else {
                res.send("Invalid username or password");
            }
        });
    } catch (error) {
        console.log(error);
    }
};
module.exports = { signup, log };