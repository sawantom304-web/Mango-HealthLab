export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);
  const status = error.status || (error.name === 'ValidationError' ? 400 : 500);
  if (status >= 500) console.error(error);
  return res.status(status).json({ success: false, message: status >= 500 ? 'Something went wrong on the server' : error.message, errors: error.errors || [] });
}
