const express = require('express');
const routes = require('../routes/route.js');

require('./db/conn');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/', routes);

app.get('/', (req, res) => {
    res.send("hello from home");
});

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});