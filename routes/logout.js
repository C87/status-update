// --- Log Out User ---
module.exports.getLogout = (req, res, next) => {
	req.session.destroy((err) => {
		if (err) {
			let err = new Error('Internal Server Error');
			err.fileName = 'logout.js';
      err.partial = 'account';
      err.route = 'Account'
      err.status = 500;
      return next(err);
		}
		return res.redirect('/login');
	})
}
