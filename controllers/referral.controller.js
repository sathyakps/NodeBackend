var tools = require('../utils/tools');
var logger = require('../utils/logger');
var mongoose = require('../utils/mongoose');
var referral = require('../models/productCode');
var user = require('../models/user');
var _ = require('lodash');
module.exports.generateReferralCode = (req, res, next) => {
	const code = new referral(req.body);
	user
		.findOne({
			email: req.params.email,
			productCodes: {
				$elemMatch: { discount: req.body.discount, productId: new mongoose.Types.ObjectId(req.body.productId) }
			}
		})
		.then(data => {
			if (!data) {
				user
					.findOneAndUpdate({ email: req.params.email }, { $push: { productCodes: code } })
					.then(editedDadta => {
						res.send(
							tools.createSuccessResponse({
								message: 'Referral code Generated',
								data: code
							})
						);
					})
					.catch(err => {
						tools.createErrorResponse({
							message: 'Failed To Generate Referral code',
							error: err
						});
					});
			} else {
				res.send(
					tools.createSuccessResponse({
						message: 'Referral code Already Generated',
						data: getReferalcodeFromUser(data, req.body)
					})
				);
			}
		});
};

module.exports.getReferralCode = (req, res, next) => {
	user
		.findOne({ 'productCodes.referCode': req.params.code }, { transactionId: 0, password: 0, iTransactionId: 0 })
		.then(data => {
			res.send(tools.createSuccessResponse({ message: 'Referral code Details', data: data }));
		})
		.catch(err => {
			res.send(tools.createErrorResponse({ message: 'Failed to Get Details', error: err }));
		});
};

getReferalcodeFromUser = (user, productCode) => {
	return _.find(user.productCodes, data => {
		return String(data.productId) === String(productCode.productId) && data.discount === productCode.discount;
	});
};

getReferralCodeFromCode = (user, code) => {
	return _.find(user.productCodes, { referCode: code });
};
