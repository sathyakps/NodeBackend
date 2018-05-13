var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var paymentMode = {
	COD: 'COD',
	CREDIT_DEBIT_CARD: 'DEBIT / CREDIT CARD',
	INTERNET_BANKING: 'INTERNET_BANKING'
};
var status = {
	SUCCESS: 'SUCCESS',
	FAILED: 'FAILED'
};

var buyerSchema = new Schema({
	name: String,
	mobile: Number,
	address: String
});

var transactionSchema = new Schema(
	{
		productQty: { required: true, type: Number },
		productId: { required: true, type: Schema.Types.ObjectId },
		paymentMode: { required: true, default: paymentMode.COD, type: String },
		status: { required: true, default: status.SUCCESS, type: String },
		referEmail: { required: true, type: String },
		totalAmount: { type: Number, required: true },
		buyerDetails: { type: buyerSchema, required: true },
		directRewardPoints: Number,
		indirectRewardPoints: Number,
		indirectRewardPoints2: Number
	},
	{ timestamps: true, _id: true, strict: true }
);

var TRANSACTIONS = mongoose.model('TRANSACTIONS', transactionSchema, 'TRANSACTIONS');
module.exports = TRANSACTIONS;
