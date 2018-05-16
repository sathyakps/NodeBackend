var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const baseOptions = {
	discriminatorKey: 'categoryName',
	collection: 'PRODUCTS',
	timestamps: true,
	_id: true
};

var productSchema = new Schema(
	{
		name: { type: String, required: true },
		price: { type: Number, required: true },
		brand: { type: String, required: true },
		description: { type: String, required: true },
		imageURL: { type: String, required: true },
		maximumDiscount: { type: Number, required: true },
		active: { type: Boolean, required: true, default: true },
		adminId: String
	},
	baseOptions
);

var lapTopSchema = new Schema({
	processor: { type: String },
	RAM: { type: Number },
	OS: { type: String },
	storage: Number,
	displaySize: Number
});

var mobileSchema = new Schema({
	RAM: { type: Number },
	screenSize: Number,
	battery: { type: Number },
	noOfSIM: { type: Number },
	memory: Number
});

var tvSchema = new Schema({
	screenSize: Number,
	screenType: String,
	smartTv: String,
	speakerOutput: Number
});

const PRODUCT = mongoose.model('PRODUCTS', productSchema);
const TV = PRODUCT.discriminator('TV', tvSchema);
const MOBILE = PRODUCT.discriminator('MOBILE', mobileSchema);
const LAPTOP = PRODUCT.discriminator('LAPTOP', lapTopSchema);

module.exports.PRODUCT = PRODUCT;
module.exports.LAPTOP = LAPTOP;
module.exports.TV = TV;
module.exports.MOBILE = MOBILE;
