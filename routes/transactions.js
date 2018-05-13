var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers/transactions.controllers');

router.post(
	'/buy/:referralCode',
	controllers.makeTransaction,
	controllers.updateDirectTransaction,
	controllers.updateIndirectTransation,
	controllers.updateIndirectTransation1
);

module.exports = router;
