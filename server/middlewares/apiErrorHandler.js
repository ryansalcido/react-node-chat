const { ApiError } = require("../utils/apiStatus");

/*
	Need to disable lint rule because without specifying "next" as a parameter,
	error is not handled properly.
*/
// eslint-disable-next-line no-unused-vars
function apiErrorHandler(err, req, res, next) {
  if(err instanceof ApiError) {
    const { statusCode, payload } = err;
    return res.status(statusCode || 400).json({ payload, error: true });
  }
  return res.status(500).json({
    error: true,
    payload: "Something went wrong"
  });
}

module.exports = apiErrorHandler;
