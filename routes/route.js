const express = require('express');
const { signup, log } = require('../controllers/controller.js');
const router = express.Router();

router.post('/signup', signup);

router.post('/log', log);

module.exports = router;