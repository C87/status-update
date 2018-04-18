const mongoose = require('mongoose');
const User = mongoose.model('User');
const validator = require('validator');

// --- Require Bcrypt ---
const bcrypt = require('bcrypt');

// --- Hash Password Promise ---
const hashPassword = (password) => {
	return new Promise((resolve, reject) => {
		bcrypt
			.hash(password, 10)
			.then((hash) => {
				resolve(hash);
			})
			.catch((err) => {
				reject(err);
			})
	});
}

module.exports.renderSignup = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Settings',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/signup.html'
	});
}

// ----- Create New User -----
module.exports.postSignupForm = (req, res, next) => {
	if (!req.body.name || !req.body.email || !req.body.password) {
    let err = new Error('All Fields Required');
    err.fileName = 'signup.js';
    err.partial = 'signup';
    err.route = 'Signup'
    err.status = 400;
    return next(err);
	}

  let emailValidation = validator.isEmail(req.body.email);
  if (!emailValidation) {
    let err = new Error('Invalid Email');
    err.fileName = 'signup.js';
    err.partial = 'signup';
    err.route = 'Signup'
    err.status = 400;
    return next(err);
  }

  let pwd = req.body.password
  let index = pwd.indexOf(" ");
  if (index >= 0) {
    let err = new Error('Invalid Password');
    err.fileName = 'signup.js';
    err.partial = 'signup';
    err.route = 'Signup'
    err.status = 400;
    return next(err);
  }

  if (pwd.length < 8) {
    let err = new Error('Password 8 Characters Minimum');
    err.fileName = 'signup.js';
    err.partial = 'signup';
    err.route = 'Signup'
    err.status = 400;
    return next(err);
  }

	// Construct new Instance of User Model (Document)
	let newUser = new User({
		name : req.body.name,
		email : req.body.email.toLowerCase(),
	});

	// Find Duplicate Email
	User
		.findOne({
			email : newUser.email
		})
		.then((user) => {
			// If Duplicate email return
			if (user) {
        let err = new Error('Duplicate Email Found');
        err.fileName = 'signup.js';
        err.partial = 'signup';
        err.route = 'Signup'
        err.status = 400;
        return next(err);
			}

			// Hash Password, insert into newUser Object and save document
			hashPassword(req.body.password)
				.then((hash) => {
					newUser.password = hash;

					// Save User
					newUser
						.save()
						.then((user) => {
							req.session.userId = user._id;
							res.redirect('/signup/username')
						})
						.catch((err) => {
							err.message = 'Internal Server Error';
              err.fileName = 'signup.js';
              err.partial = 'signup';
              err.route = 'Signup'
              err.status = 500;
              return next(err);
						})
				})
				.catch((err) => {
          err.message = 'Failed to Save Password';
          err.fileName = 'signup.js';
          err.partial = 'signup';
          err.route = 'Signup'
          err.status = 424;
          return next(err);

				})
		})
		.catch((err) => {
			err.message = 'Internal Server Error';
      err.fileName = 'signup.js';
      err.partial = 'signup';
      err.route = 'Signup'
      err.status = 500;
      return next(err);
		})
}
