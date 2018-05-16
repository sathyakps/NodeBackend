var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var logger = require('./utils/logger');
var tools = require('./utils/tools');
var mongoose = require('./utils/mongoose');


// Loading .ENV files into the environment using dotenv
require('dotenv').config();

// Intializing the express server
var app = express();
var router = express.Router();

// Using Morgan and Winston for logging
// app.use(morgan('combined', { stream: logger.stream }));

var port = process.env.PORT || 3000;

// Using body parser, so we can get info from POST and/or URL parameters
app.use(bodyParser.urlencoded({ extended: true }));
app.use(require('body-parser').json({ type: '*/*' }));

// Enable CORS from client-side
app.use(tools.defaultResponseHeaders);

// Configuring Routes
var userRoutes = require('./routes/user');
var adminRoutes = require('./routes/admin');
var transactionRoutes = require('./routes/transactions');
var refer = require('./routes/referral');
var data = require('./routes/data');
// User Routes
app.use(userRoutes);
app.use(adminRoutes);
app.use(transactionRoutes);
app.use(refer);
app.use(data);

app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/transactions', transactionRoutes);
app.use('/referral', refer);
app.use('/data', data);

// Starting the Express Server
app.listen(port, logger.info(`Application Started and running in ${port}`));
