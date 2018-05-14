var tools = require('../utils/tools');
var logger = require('../utils/logger');
var mongoose = require('../utils/mongoose');
var products = require('../models/product.js');

module.exports.addProduct = (req, res, next) => {
	var product;
	if (req.body.type === 'MOBILE') {
		product = new products.MOBILE(req.body);
	} else if (req.body.type === 'TV') {
		product = new products.TV(req.body);
	} else if (req.body.type === 'LAPTOP') {
		product = new products.LAPTOP(req.body);
	}
	if (product) {
		product
			.save()
			.then(data => {
				res.send(tools.createSuccessResponse({ message: 'Product Added Successfully', data: data }));
			})
			.catch(err => {
				res.send(tools.createErrorResponse({ message: 'Failed Adding Product', error: err }));
			});
	}
};

module.exports.getProduct = (req, res, next) => {
	products.PRODUCT.find({ adminId: req.params.adminId, active: true })
		.then(data => {
			res.send(res.send(tools.createSuccessResponse({ message: 'All Products', data: data })));
		})
		.catch(err => {
			res.send(tools.createErrorResponse({ message: 'Failed Fetching Products', error: err }));
		});
};
module.exports.updateProduct = (req, res, next) => {
	var productId = new mongoose.Types.ObjectId(req.params.productId);
	products.PRODUCT.findByIdAndUpdate({ _id: productId }, req.body)
		.then(data => {
			res.send(tools.createSuccessResponse({ message: 'Product Updated Successfully', data: data }));
		})
		.catch(err => {
			res.send(tools.createErrorResponse({ message: 'Failed updating Product', error: err }));
		});
};

module.exports.deactivateProduct = (req, res, next) => {
	var productId = new mongoose.Types.ObjectId(req.params.productId);
	products.PRODUCT.findOneAndUpdate({ _id: productId }, { active: false })
		.then(res.send(tools.createSuccessResponse({ message: 'Product Deactivated Successfully' })))
		.catch(err => {
			res.send(tools.createErrorResponse({ message: 'Failed Deactivating Product', error: err }));
		});
};

module.exports.activateProduct = (req, res, next) => {
	var productId = new mongoose.Types.ObjectId(req.params.productId);
	products.PRODUCT.findOneAndUpdate({ _id: productId }, { active: true })
		.then(res.send(tools.createSuccessResponse({ message: 'Product Activated Successfully' })))
		.catch(err => {
			res.send(tools.createErrorResponse({ message: 'Failed deactivated Product', error: err }));
		});
};

module.exports.getAllProducts = (req, res, next) => {
	products.PRODUCT.find({ active: true })
		.then(data => {
			res.send(tools.createSuccessResponse({ message: 'All Products', data: data }));
		})
		.catch(err => {
			logger.error(err);
			res.send(tools.createErrorResponse({ message: 'Failed Fetching Products', error: err }));
		});
};
