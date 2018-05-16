var tools = require('../utils/tools');
var logger = require('../utils/logger');
var mongoose = require('../utils/mongoose');
var transaction = require('../models/transaction.js');
var product = require('../models/product.js');
var user = require('../models/user.js');

module.exports.makeTransaction = (req, res, next) => {
	const rewardPoints = calculateReferralPoints(req.body.maxDiscount, req.body.appliedDiscount, req.body.totalAmount);
	req.body.directRewardPoints = rewardPoints;
	req.body.indirectRewardPoints = Math.ceil(rewardPoints * 0.1);
	req.body.indirectRewardPoints2 = Math.ceil(req.body.indirectRewardPoints * 0.1);
	const trans = new transaction(req.body);
	trans.save((err, data) => {
		if (!err) {
			res.locals.transactionData = data;
			next();
		} else {
			res.send(tools.createErrorResponse({ message: 'Failed Transaction' }));
		}
	});
};

module.exports.updateDirectTransaction = (req, res, next) => {
	user.findOneAndUpdate(
		{ email: res.locals.transactionData.referEmail },
		{
			$push: { transactionIds: res.locals.transactionData._id },
			$inc: { rewardPoints: res.locals.transactionData.directRewardPoints }
		},
		{ new: true },
		(err, data) => {
			if (!err) {
				res.locals.directRefer = data;
				next();
			} else {
				transaction.remove({ _id: new mongoose.Types.ObjectId(res.locals.transactionData._id) }, () => {
					res.send(tools.createErrorResponse({ message: 'Failed Transaction' }));
				});
			}
		}
	);
};

module.exports.updateIndirectTransation = (req, res, next) => {
	referralCode = res.locals.directRefer.referee;
	if (referralCode) {
		user.findOneAndUpdate(
			{ referralCode: referralCode },
			{
				$push: { iTransactionId: res.locals.transactionData._id },
				$inc: { rewardPoints: res.locals.transactionData.indirectRewardPoints }
			},
			{ new: true },
			(err, data) => {
				if (!err) {
					res.locals.indirectRefer = data;
					next();
				} else {
					user.findOneAndUpdate(
						{ email: res.locals.transactionData.referEmail },
						{
							$pull: { transactionIds: res.locals.transactionData._id },
							$dec: { rewardPoints: res.locals.transactionData.directRewardPoints }
						},
						{ new: true },
						(err, data) => {
							transaction.remove(
								{ _id: new mongoose.Types.ObjectId(res.locals.transactionData._id) },
								() => {
									res.send(tools.createErrorResponse({ message: 'Failed Transaction' }));
								}
							);
						}
					);
				}
			}
		);
	} else {
		res.send(
			tools.createSuccessResponse({
				message: 'Transaction Successfull',
				data: res.locals.transactionData
			})
		);
	}
};

module.exports.updateIndirectTransation1 = (req, res, next) => {
	referralCode = res.locals.indirectRefer.referee;
	if (referralCode) {
		user.findOneAndUpdate(
			{ referralCode: referralCode },
			{
				$push: { iTransactionId2: res.locals.transactionData._id },
				$inc: { rewardPoints: Math.ceil(res.locals.transactionData.indirectRewardPoints * 0.1) }
			},
			{ new: true },
			(err, data) => {
				if (!err) {
					// addTransactionToProduct(res.locals.transactionData.productId, res.locals.transactionData._id);
					res.send(
						tools.createSuccessResponse({
							message: 'Transaction Successfull',
							data: res.locals.transactionData
						})
					);
				}
			}
		);
	}
};

calculateReferralPoints = (maxDiscount, availedDiscount, price) => {
	defaultDiscountPoints = price * 0.01;
	availedDiscountPoints = price * ((maxDiscount - availedDiscount) / 100);
	return Math.ceil(defaultDiscountPoints + availedDiscountPoints);
};
