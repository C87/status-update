// Redirect logged out users to login page when attempting to access routes behind login
module.exports.requiresLogin = (req, res, next) => {
	if (!req.session.userId) {
		return res.redirect('/login');
	}
	return next();
}

// Redirect logged in users to home route when attempting to access routes for logged out users
module.exports.requiresLogout = (req, res, next) => {
	if (req.session.userId) {
		return res.redirect('/');
	}
	return next();
}

// Verify that the user has a username, else redirect them to signup/username
module.exports.verifyUsername = (req, res, next) => {
  if (!req.session.username) {
    return res.redirect('/signup/username')
  }
  return next();
}

// Verify that the status form contains a string, if str <= 0 redirect back to /status route.
module.exports.verifyStatusFormData = (req, res, next) => {
	let str = req.body.text.replace(/\s/g, "");
	if (str.length <= 0) {
		return res.redirect('/status');
	}
	return next();
}

// Verify that the comments form contains a string, if str <= 0 redirect back to route.
module.exports.verifyCommentsFormData = (req, res, next) => {
	let str = req.body.comment.replace(/\s/g, "");
	if (str.length <= 0) {
		return res.redirect(`${req.url}`);
	}
	return next();
}

module.exports.verifyUsernameFormData = (req, res, next) => {
	if (!req.body.username) {
		return res.redirect(`${req.url}`)
	}
  let str = req.body.username.replace(/\s/g, "");
	if (str.length <= 0) {
		return res.redirect(`${req.url}`);
	}
  req.body.username = str;
	return next();
}

// Compare username against reserved words and if username is equal to an item in the reservedWords array run the next error checking middleware
module.exports.reservedWords = (req, res, next) => {
	let username = req.body.username.toLowerCase();
	let reservedWords = ['account', 'login', 'logout', 'more', 'new', 'password-reset', 'signup', 'status', 'undefined'];

	for (let i in reservedWords) {
		if (username === reservedWords[i]) {
			let err = new Error('Username taken try again');
			err.status = 400;
			return next(err);
		}
	}
	next();
}
