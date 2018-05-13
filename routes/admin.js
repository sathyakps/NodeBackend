var express = require('express'),
	router = express.Router(),
	controllers = require('../controllers/admin.controllers');

router.post('/product', controllers.addProduct);
router.get('/product/:adminId', controllers.getProduct);
router.get('/product/activate/:productId', controllers.activateProduct);
router.put('/product/:productId', controllers.updateProduct);
router.delete('/product/:productId', controllers.deactivateProduct);
module.exports = router;
