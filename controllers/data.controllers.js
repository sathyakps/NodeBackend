var tools = require('../utils/tools');
var logger = require('../utils/logger');
var mongoose = require('../utils/mongoose');
var user = require('../models/user.js');
var product = require('../models/product.js');

module.exports.getTransactionDataPerUser = (req, res, next) => {
	user.aggregate(
		[
			{ $match: { email: req.params.email } },
			{
				$lookup: {
					from: 'TRANSACTIONS',
					localField: 'transactionIds',
					foreignField: '_id',
					as: 'directTransactions'
				}
			},
			{
				$lookup: {
					from: 'TRANSACTIONS',
					localField: 'iTransactionId',
					foreignField: '_id',
					as: 'idirectTransactions1'
				}
			},
			{
				$lookup: {
					from: 'TRANSACTIONS',
					localField: 'iTransactionId2',
					foreignField: '_id',
					as: 'idirectTransactions2'
				}
			}
		],
		(err, data) => {
			if (!err) {
				res.send(tools.createSuccessResponse({ message: 'Success', data: data[0] }));
			} else {
				res.send(tools.createErrorResponse({ message: 'Failed', error: err['message'] }));
			}
		}
	);
};

module.exports.getTransactionDataPerProduct = (req, res, next) => {
	product.PRODUCT.aggregate(
		[
			{ $match: { adminId: req.params.email } },
			{
				$lookup: {
					from: 'TRANSACTIONS',
					localField: '_id',
					foreignField: 'productId',
					as: 'transactionDetails'
				}
			}
		],
		(err, data) => {
			if (!err) {
				res.send(tools.createSuccessResponse({ message: 'Success', data: data }));
			} else {
				res.send(tools.createErrorResponse({ message: 'Failed', error: err['message'] }));
			}
		}
	);
};
