var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var shortId = require('shortid');
var productReferSchema = require('./productCode');
var bcrypt = require('bcrypt');
var SALT_WORK_FACTOR = 4;
const Role = {
	SUPER_ADMIN: 'SUPER_ADMIN',
	ADMIN: 'ADMIN',
	USER: 'USER'
};

var userSchema = new Schema(
	{
		email: {
			type: String,
			required: [true, 'User Email Id Required'],
			unique: [true, 'Email Id Already Registered']
		},
		password: { type: String, required: [true, 'Password Required'] },
		name: { type: String, required: [true, 'User Name Required'] },
		mobile: {
			type: Number,
			required: [true, 'User Mobile Number Required'],
			validate: {
				validator: function(v) {
					return /\d{10}/.test(v);
				},
				message: '{VALUE} is not a valid phone number!'
			}
		},
		referee: { type: String, default: null },
		referralList: { type: Array, default: [] },
		transactionIds: { type: Array, default: [] },
		iTransactionId: { type: Array, default: [] },
		iTransactionId2: { type: Array, default: [] },
		referralCode: { type: String, default: shortId.generate, unique: true },
		productCodes: { type: Array, default: [] },
		rewardPoints: { type: Number, default: 0 },
		role: { type: String, default: Role.USER }
	},
	{ timestamps: true, _id: true, strict: false }
);

userSchema.pre('save', function(next) {
	var user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err) return next(err);

		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);

			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err) return cb(err);
		cb(null, isMatch);
	});
};

var USER = mongoose.model('USERS', userSchema, 'USERS');
module.exports = USER;
