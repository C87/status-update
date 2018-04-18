module.exports.pageNotFound = (req, res, next) => {
	let err = new Error('Page Not Found');
  err.fileName = 'page.js';
  err.partial = 'error';
  err.route = '404'
  err.status = 404;
  return next(err);
}
