const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports.renderSettingsMenu = (req, res, next) => {
    res.render('index.html', {
  		title : 'Status Update | Settings',
  		stylesheet : '/css/stylesheet.css',
  		partial : 'partials/account.html',
      username : req.session.username
    });
}

module.exports.renderEmail = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Change Email',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/email.html'
	});
}

module.exports.renderPassword = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Change Password',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/password.html'
	});
}

module.exports.renderUsername = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Change Username',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/username.html'
	});
}

module.exports.renderName = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Change Name',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/name.html'
	});
}

module.exports.renderDeactivate = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | Deactivate Account',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/deactivate.html'
	});
}
