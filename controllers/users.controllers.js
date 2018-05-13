var tools = require('../utils/tools');
var user = require('../models/user.js');
var logger = require('../utils/logger');
var mongoose = require('../utils/mongoose');
var assert = require('assert');

module.exports.login = (req, res, next) => {
	try {
		user.findOne({ email: req.body.email }, function(err, userData) {
			if (err || !userData) {
				res.send(tools.createErrorResponse({ message: 'User Not Found' }));
			} else {
				userData.comparePassword(req.body.password, function(err, isMatch) {
					if (err) throw err;
					if (isMatch) {
						res.send(tools.createSuccessResponse({ message: 'User Logged in Successfully' }));
					} else {
						res.send(tools.createErrorResponse({ message: 'Invalid Password' }));
					}
				});
			}
		});
	} catch (e) {
		logger.error(e);
	}
};
module.exports.signUp = async (req, res, next) => {
	try {
		const newUser = new user(req.body);
		newUser
			.save()
			.then(data => {
				if (data['referee']) {
					res.locals.userData = data;
					next();
				} else {
					res.send(tools.createSuccessResponse({ message: 'User Created Successfully', data: data }));
				}
			})
			.catch(err => {
				res.send(tools.createErrorResponse({ message: 'User Registration Failed', error: err['message'] }));
			});
	} catch (e) {
		logger.error(e);
	}
};

module.exports.getProfile = (req, res, next) => {
	try {
		user.aggregate(
			[
				{ $match: { email: req.params.email } },
				{
					$graphLookup: {
						from: 'USERS',
						startWith: '$referralList',
						connectFromField: 'referralList',
						connectToField: 'email',
						as: 'referralUsers',
						maxDepth: 2,
						depthField: 'friendLevel'
					}
				},
				{
					$project: {
						password: 0
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
	} catch (e) {
		logger.error(e);
	}
};

module.exports.addReferralsToUsers = (req, res, next) => {
	user
		.findOneAndUpdate(
			{ referralCode: res.locals.userData.referee },
			{ $push: { referralList: res.locals.userData.email } }
		)
		.then(data => {
			res.send(
				tools.createSuccessResponse({
					message: 'User Created Successfully and Referral Updated',
					data: res.locals.userData
				})
			);
		})
		.catch(err => {
			user.findOneAndRemove({ email: res.locals.userData.email }, (err, success) => {
				res.send(
					tools.createErrorResponse({
						message: 'User Regestration Failed',
						error: 'Check whether all fields are valid including referral id'
					})
				);
			});
		});
};
