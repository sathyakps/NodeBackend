var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers/referral.controller');

router.post('/code/:email', controllers.generateReferralCode);
router.get('/:code', controllers.getReferralCode);

module.exports = router;
