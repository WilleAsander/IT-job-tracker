var express = require('express');
var router = express.Router();
var register_controller = require('../controllers/register');

router.post('/register', register_controller.userRegister);
router.get('/:id', register_controller.login);
router.get('/', register_controller.list);

module.exports = router;