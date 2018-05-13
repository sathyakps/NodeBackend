var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortId = require('shortid');
var productReferralSchema = new Schema(
	{
		productId: Schema.Types.ObjectId,
		discount: Number,
		referCode: { type: String, default: shortId.generate, unique: false }
	},
	{ timestamps: true, _id: false }
);

var REFER = mongoose.model('REFER', productReferralSchema, 'USERS');

module.exports = REFER;
