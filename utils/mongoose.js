var mongoose = require('mongoose');
var logger = require('./logger');
require('dotenv').config();

 mongoose.connect(process.env.ATLAS_URL, logger.info(`Moongoose is Connected to Atlas`));
module.exports = mongoose;
