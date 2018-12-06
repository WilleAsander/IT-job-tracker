var express = require('express');
var router = express.Router();
var location_controller = require('../controllers/location');

router.get('/', location_controller.userLocation);
module.exports = router;