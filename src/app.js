const express = require('express');
const path = require('path');
const routes = require('../routes/route.js');
const session = require('express-session');
const cookie_parser = require('cookie-parser');
const flash = require('connect-flash');
require('./db/conn');

const view_path = path.join(__dirname, "../views")

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "hbs");
app.set("views", view_path);
app.use(express.static(path.join(__dirname, "../public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie_parser());
app.use(session({
    secret: 'secret123',
    saveUninitialized: true,
    resave: false,
    cookie: { secure: false, maxAge: 60000 }
}));
app.use(flash());
app.use('/', routes);

app.get('/', (req, res, next) => {
    res.render("index", {
        serverSuccess: req.flash('server-success')
    });
});
app.get('*', (req, res) => {
    res.send("route does not exist! ")
})

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});