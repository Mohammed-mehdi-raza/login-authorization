const register = require('../models/register.js');
const bcrypt = require('bcryptjs');
//const flash = require('connect-flash');

const index = (req, res) => {
    res.render("index", {
        serverSuccess: req.flash('server-success'),
        serverError: req.flash('server-error')
    });
};

const registers = (req, res) => {
    res.render("register", {
        serverSuccess: req.flash('server-success'),
        serverError: req.flash('server-error')
    });
};

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
                            req.flash("server-success", "user added successfully");
                            res.redirect("/register");
                        }
                    });
                }
            });

        } else {
            req.flash("server-error", "password does not match");
            res.redirect("/register");
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
        if (newu == null) {
            req.flash("server-error", "invalid username or password");
            res.redirect("/index");
        } else {
            bcrypt.compare(pass, newu.password, (err, result) => {
                if (err) {
                    console.log(`error in comparng bcrypt: ${err}`);
                } else if (result) {
                    res.send(newu);
                } else {
                    req.flash("server-error", "invalid username or password");
                    res.redirect("/index");
                }
            });
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports = { signup, log, index, registers };