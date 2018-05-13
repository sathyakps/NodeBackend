module.exports.defaultResponseHeaders = (req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
	);
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	next();
};

module.exports.createSuccessResponse = ({ message, data, status }) => {
	return {
		timestamp: new Date().getTime(),
		success: true,
		status,
		message,
		data
	};
};

module.exports.createErrorResponse = ({ message, error, status }) => {
	if (!status) status = 400;

	return {
		status,
		success: false,
		timestamp: new Date().toISOString(),
		message,
		error
	};
};

const createAccessDeniedErrorResponse = status => {
	if (!status) status = 401;

	return createErrorResponse({ error: 'Access Denied', status });
};
