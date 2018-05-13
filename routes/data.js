var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers/data.controllers');

router.get('/user/:email', controllers.getTransactionDataPerUser);
router.get('/product/:email', controllers.getTransactionDataPerProduct);

module.exports = router;
