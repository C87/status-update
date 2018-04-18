const mongoose = require('mongoose');
const User = mongoose.model('User');

// --- Require Bcrypt ---
const bcrypt = require('bcrypt');

// --- Get Request Render Log In Template ---
module.exports.renderLogin = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Login',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/login.html'
	});
}

// --- Post Request Log In User ---
module.exports.postLoginForm = (req, res, next) => {
	if (!req.body.email && !req.body.password) {
    let err = new Error('All Fields Required');
    err.fileName = 'login.js';
    err.partial = 'login';
    err.route = 'Login'
    err.status = 400;
    return next(err);
	};

	User
		.findOne({
			email : req.body.email.toLowerCase()
		})
		.then((user) => {
			if (!user) {
        let err = new Error('Email or Password Incorrect');
        err.fileName = 'login.js';
        err.partial = 'login';
        err.route = 'Login'
        err.status = 400;
        return next(err);
			}

			bcrypt
				.compare(req.body.password, user.password)
				.then((result) => {
					if (result) {
						req.session.userId = user._id;
            req.session.username = user.username;
						return res.redirect('/');
					}
					let err = new Error('Email or Password Incorrect');
					err.fileName = 'login.js';
          err.partial = 'login';
          err.route = 'Login'
					err.status = 400;
					return next(err);
				})
				.catch((err) => {
					err.message = 'Failed to Verify User';
					err.fileName = 'login.js';
          err.partial = 'login';
          err.route = 'Login'
					err.status = 424;
					return next(err);
				})
		})
		.catch((err) => {
			err.message = 'Internal Server Error';
			err.fileName = 'login.js';
      err.partial = 'login';
      err.route = 'Login'
			err.status = 500;
			return next(err);
		})
}
