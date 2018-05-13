var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers/users.controllers');

router.post('/login', controllers.login);
router.post('/signup', controllers.signUp, controllers.addReferralsToUsers);
router.get('/profile/:email', controllers.getProfile);

module.exports = router;
