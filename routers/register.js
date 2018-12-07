var express = require('express');
var router = express.Router();
var register_controller = require('../controllers/register');

router.post('/', register_controller.userRegister);
module.exports = router;