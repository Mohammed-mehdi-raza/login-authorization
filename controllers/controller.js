const register = require('../models/register.js');
const bcrypt = require('bcryptjs');
//const flash = require('connect-flash');
const nodemailer = require('nodemailer');
const crypto = require('crypto')

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
            req.flash("server-error", "user not found");
            res.redirect("/index");
        } else {
            bcrypt.compare(pass, newu.password, (err, result) => {
                if (err) {
                    console.log(`error in comparng bcrypt: ${err}`);
                } else if (result) {
                    res.render("user", {
                        user: newu
                    });
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

const del = async(req, res) => {
    try {
        const us = req.params.name;
        await register.deleteOne({ username: us }, (err) => {
            if (err) {
                console.log(err);
                res.send("uff!");
            } else {
                req.flash("server-success", "successfully deleted ");
                res.redirect("/index");
            }
        })
    } catch (error) {
        console.log(error);
    }
}

const up = async(req, res) => {
    const name = req.params.name;
    const unew = await register.findOne({ username: name });
    res.render("update", {
        user: unew,
        serverSuccess: req.flash('server-success'),
        serverError: req.flash('server-error')
    });
};

const update = (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.cpassword;
        if (password == cpassword) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(`error in generating salt: ${err} `);
                } else {
                    bcrypt.hash(password, salt, async(error, hash) => {
                        if (error) {
                            console.log(`error in hashing password: ${error}`);
                        } else {
                            const name = req.params.name;
                            register.updateOne({ username: name }, {
                                username: req.body.username,
                                firstname: req.body.firstname,
                                lastname: req.body.lastname,
                                email: req.body.email,
                                password: hash
                            }, (e, r) => {
                                if (e) {
                                    console.log(e);
                                } else {
                                    req.flash("server-success", "user updated successfully");
                                    res.redirect("/log/update/:name");
                                }
                            });
                        }
                    });
                }
            });

        } else {
            req.flash("server-error", "password does not match");
            res.redirect("/log/update/:name");
        }
    } catch (err) {
        console.log(err);
    }
}

const forgot = (req, res) => {
    res.render("forgot", {
        serverSucess: req.flash('server-sucess'),
        serverError: req.flash('server-error')
    });
};


const forg = async(req, res) => {
    vEmail = req.body.vEmail;
    try {
        const u = await register.findOne({ email: vEmail });
        if (u == null) {
            req.flash('server-error', "Invalid Email");
            res.redirect('/forgot');
        } else {
            try {
                var buf = crypto.randomBytes(20);
                var token = buf.toString('hex');
                u.resetToken = token;
                u.resetTimer = Date.now() + 3600000;
                await u.save();
                let transporter = nodemailer.createTransport({
                    name: "SMTP",
                    host: "smtp.gmail.com",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "loginsite348@gmail.com",
                        pass: "loginsite"
                    }
                });
                const link = "https://login-authorization-ten.vercel.app/forgot/" + token;
                const info = await transporter.sendMail({
                    from: "loginsite348@gmail.com",
                    to: u.email,
                    subject: "Reset password",
                    text: "Hi,\n\n To change your password go to he following link https://login-authorization-ten.vercel.app/forgot/" + token + "\n\n Note: This is only valid for one hour",
                    html: `<p> Hi, <br><br> To change your password go to following link <a href=${link}>${link}</a><br><br>Note:This link is only valid for one hour</P>`
                });
                console.log(info);
                req.flash('server-sucess', "An email has been sent to your account with further instructions");
                res.redirect('/forgot');
            } catch (e) {
                console.log(e);
                req.flash('server-error', "An error occured while sending Email");
                res.redirect('/forgot');
            }
        }

    } catch (e) {
        console.log(e);
    }
};

const reset = async(req, res) => {
    const token = req.params.token;
    const u = await register.findOne({ resetToken: token, resetTimer: { $gt: Date.now() } });
    if (u == null) {
        res.json({
            "message": "link has been expired"
        });
    } else {
        res.render("reset", {
            user: u,
            serverSucess: req.flash('server-sucess'),
            serverError: req.flash('server-error')
        });
    }
};

const pReset = async(req, res) => {
    try {
        const pass = req.body.password;
        const cpass = req.body.cpassword;
        if (pass == cpass) {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) {
                    console.log(`error in generating salt: ${err} `);
                } else {
                    bcrypt.hash(pass, salt, async(error, hash) => {
                        if (error) {
                            console.log(`error in hashing password: ${error}`);
                        } else {
                            const token = req.params.token;
                            register.updateOne({ resetToken: token }, {
                                password: hash,
                                resetToken: null,
                                resetTimer: null
                            }, (e, r) => {
                                if (e) {
                                    console.log(e);
                                } else {
                                    req.flash("server-success", "password changed successfully");
                                    res.redirect("/index");
                                }
                            });
                        }
                    });
                }
            });
        } else {
            req.flash("server-error", "password does not match");
            res.redirect("/forgot/" + req.params.token);
        }
    } catch (e) {
        console.log(e)
    }

};

module.exports = { signup, log, index, registers, del, up, update, forgot, forg, reset, pReset };