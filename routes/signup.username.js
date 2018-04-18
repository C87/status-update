const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.renderUsername = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Username',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/signup.username.html'
	});
}

module.exports.postUsernameForm = (req, res, next) => {
	let userId = req.session.userId
	let username = req.body.username.toLowerCase();
  req.session.username = username;

	User
		.findOne({
			username : username
		})
		.then((doc) => {
			if (doc) {
        let err = new Error('Username taken try again');
        err.fileName = 'signup.username.js';
        err.partial = 'signup.username';
        err.route = 'Signup'
        err.status = 400;
        return next(err);
			}
			User
				.updateOne({
					_id : userId
				}, {
					username : username
				})
				.then(() => {
					res.redirect('/')
				})
				.catch((err) => {
					err.message = 'Internal Server Error';
          err.fileName = 'signup.username.js';
          err.partial = 'signup.username';
          err.route = 'Signup'
          err.status = 500;
          return next(err);
				})
		})
		.catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'signup.username.js';
      err.partial = 'signup.username';
      err.route = 'Signup'
      err.status = 500;
      return next(err);
		})
}
