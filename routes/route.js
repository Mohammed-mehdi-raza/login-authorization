const express = require('express');
const { signup, log, index, registers, del, up, update } = require('../controllers/controller.js');
const router = express.Router();

router.get('/index', index);

router.get('/register', registers);

router.post('/signup', signup);

router.post('/log', log);

router.get('/delete/:name', del);

router.get('/log/update/:name', up);

router.post('/log/update/:name/up', update);

module.exports = router;