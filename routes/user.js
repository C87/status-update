const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');
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

// Update Password
module.exports.updatePassword = (req, res, next) => {
  if (!req.body.currentPassword || !req.body.newPassword || !req.body.confirmNewPassword) {
		let err = new Error('All fields required');
    err.fileName = 'user.js';
    err.partial = 'password';
    err.route = 'Change Password'
    err.status = 400;
    return next(err);
	}

  if (req.body.newPassword !== req.body.confirmNewPassword) {
		let err = new Error('Both passwords must match');
    err.fileName = 'user.js';
    err.partial = 'password';
    err.route = 'Change Password'
    err.status = 400;
    return next(err);
	}

  let pwd = req.body.newPassword
  let index = pwd.indexOf(" ");
  if (index >= 0) {
    let err = new Error('Invalid Password');
    err.fileName = 'user.js';
    err.partial = 'password';
    err.route = 'Change Password'
    err.status = 400;
    return next(err);
  }

  if (pwd.length < 8) {
    let err = new Error('Password 8 Characters Minimum');
    err.fileName = 'user.js';
    err.partial = 'password';
    err.route = 'Change Password'
    err.status = 422;
    return next(err);
  }


  User
    .findOne({
      _id : req.session.userId
    })
    .then((doc) => {
      if (!doc) {
        let err = new Error('Internal Server Error');
        err.fileName = 'user.js';
        err.partial = 'password';
        err.route = 'Change Password'
  			err.status = 500;
  			return next(err);
			}
      bcrypt
				.compare(req.body.currentPassword, doc.password)
        .then((result) => {
					if (result) {
            // Hash New Password
      			return hashPassword(req.body.confirmNewPassword)
            .then((hash) => {
              User
                .findOneAndUpdate({
            			_id : req.session.userId
            		}, {
            			password : hash
            		})
                .then(() => {
                  return res.render('index.html', {
                		title : 'Status Update | Change Password',
                		stylesheet : '/css/stylesheet.css',
                		partial : 'partials/password.html',
                    notice : 'Password successfully changed'
                	});
            		})
                .catch((err) => {
                  err.mesage = 'Internal Server Error';
                  err.fileName = 'user.js';
                  err.partial = 'password';
                  err.route = 'Change Password'
                  err.status = 500;
                  return next(err);
                })
      				})
      				.catch((err) => {
                err.message = 'Failed to Save Password';
                err.fileName = 'user.js';
                err.partial = 'password';
                err.route = 'Change Password'
                err.status = 424;
                return next(err);
      				})
					}
          let err = new Error('Password Incorrect');
					err.fileName = 'user.js';
          err.partial = 'password';
          err.route = 'Change Password'
					err.status = 400;
					return next(err);
				})
        .catch((err) => {
          err.message = 'Failed to Verify User';
					err.fileName = 'user.js';
          err.partial = 'password';
          err.route = 'Change Password'
					err.status = 424;
					return next(err);
        })
    })
    .catch((err) => {
			err.message = 'Internal Server Error';
			err.fileName = 'user.js';
      err.partial = 'password';
      err.route = 'Change Password'
			err.status = 500;
			return next(err);
		});
}

module.exports.updateEmail = (req, res, next) => {
	if (!req.body.newEmail || !req.body.confirmNewEmail) {
		let err = new Error('All fields required');
    err.fileName = 'user.js';
    err.partial = 'email';
    err.route = 'Change Email'
    err.status = 400;
    return next(err);
	}

	let newEmail = req.body.newEmail.toLowerCase();
	let confirmNewEmail = req.body.confirmNewEmail.toLowerCase();

	if (newEmail !== confirmNewEmail) {
		let err = new Error('Both emails must match');
    err.fileName = 'user.js';
    err.partial = 'email';
    err.route = 'Change Email'
    err.status = 400;
    return next(err);
	}

  let emailValidation = validator.isEmail(req.body.newEmail);
  if (!emailValidation) {
    let err = new Error('Invalid Email');
    err.fileName = 'user.js';
    err.partial = 'email';
    err.route = 'Change Email'
    err.status = 400;
    return next(err);
  }

  User
    .findOne({
      email : newEmail
    })
    .then((doc) => {
      if (doc) {
        let err = new Error('Email taken');
        err.fileName = 'user.js';
        err.partial = 'email';
        err.route = 'Change Email'
        err.status = 400;
        return next(err);
      }

      User
    		.findOneAndUpdate({
    			_id : req.session.userId
    		}, {
    			email : newEmail
    		})
    		.then(() => {
          res.render('index.html', {
        		title : 'Status Update | Change Email',
        		stylesheet : '/css/stylesheet.css',
        		partial : 'partials/email.html',
            notice : 'Email successfully changed'
        	});
    		})
        .catch((err) => {
          err.mesage = 'Internal Server Error';
          err.fileName = 'user.js';
          err.partial = 'email';
          err.route = 'Change Email'
          err.status = 500;
          return next(err);
        });
    })
    .catch((err) => {
      err.mesage = 'Internal Server Error';
      err.fileName = 'user.js';
      err.partial = 'email';
      err.route = 'Change Email'
      err.status = 500;
      return next(err);
    })
}

module.exports.updateUsername = (req, res, next) => {
	let username = req.body.username.toLowerCase();

  User
    .findOne({
      username : username
    })
    .then((doc) => {
      if (doc) {
        let err = new Error('Username taken');
        err.fileName = 'user.js';
        err.partial = 'username';
        err.route = 'Change Username'
        err.status = 400;
        return next(err);
      }

      User
        .findOneAndUpdate({
          _id : req.session.userId
        }, {
          username : username
        })
        .then(() => {
          req.session.username = username;
          res.render('index.html', {
            title : 'Status Update | Change Username',
            stylesheet : '/css/stylesheet.css',
            partial : 'partials/username.html',
            notice : 'Username successfully changed'
          });
        })
        .catch((err) => {
          err.mesage = 'Internal Server Error';
          err.fileName = 'user.js';
          err.partial = 'username';
          err.route = 'Change Username'
          err.status = 500;
          return next(err);
        });
    })
    .catch((err) => {
      err.mesage = 'Internal Server Error';
      err.fileName = 'user.js';
      err.partial = 'username';
      err.route = 'Change Username'
      err.status = 500;
      return next(err);
    })
}

module.exports.updateName = (req, res, next) => {
	User
		.findOneAndUpdate({
			_id : req.session.userId
		}, {
			name : req.body.name
		})
		.then(() => {
      res.render('index.html', {
        title : 'Status Update | Update Name',
        stylesheet : '/css/stylesheet.css',
        partial : 'partials/name.html',
        notice : 'Name successfully updated'
      });
		})
    .catch((err) => {
      err.mesage = 'Internal Server Error';
      err.fileName = 'user.js';
      err.partial = 'name';
      err.route = 'Update Name'
      err.status = 500;
      return next(err);
    })
}


// // ----- Delete Existing User -----
module.exports.deleteUser = (req, res) => {
	User
		.deleteOne({
			_id : req.session.userId
		})
		.then((user) => {
      Post
        .deleteMany({
          user : req.session.userId
        })
        .then((post) => {
          Post
            .updateMany({
              'comments.user' : req.session.userId
            }, {
              $pull: {
                comments : {
                  user : req.session.userId
                }
              }
            })
            .then((doc) => {
              req.session.destroy((err) => {
            		if (err) {
            			let err = new Error('Internal Server Error');
                  err.fileName = 'user.js';
                  err.partial = 'deactivate';
                  err.route = 'Deactivate'
                  err.status = 500;
            			return next(err);
            		}
            		return res.redirect('/login');
              });
            })
            .catch((err) => {
              err.mesage = 'Internal Server Error';
              err.fileName = 'user.js';
              err.partial = 'deactivate';
              err.route = 'Deactivate'
              err.status = 500;
              return next(err);
            })
		    })
        .catch((err) => {
          err.mesage = 'Internal Server Error';
          err.fileName = 'user.js';
          err.partial = 'deactivate';
          err.route = 'Deactivate'
          err.status = 500;
          return next(err);
        })
    })
    .catch((err) => {
      err.mesage = 'Internal Server Error';
      err.fileName = 'user.js';
      err.partial = 'deactivate';
      err.route = 'Deactivate'
      err.status = 500;
      return next(err);
    });
}
