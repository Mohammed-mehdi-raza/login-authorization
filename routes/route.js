const express = require('express');
const { signup, log, index, registers, del } = require('../controllers/controller.js');
const router = express.Router();

router.get('/index', index);

router.get('/register', registers);

router.post('/signup', signup);

router.post('/log', log);

router.get('/delete/:name', del);

module.exports = router;