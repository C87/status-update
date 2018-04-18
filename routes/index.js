// --- Initalise Express Router ---
const express = require('express');
const router = express.Router();

// --- Require in Custom Middleware ---
const mw = require('../middleware');

// --- Require in Route Modules ---
const account = require('./account.js');
const home = require('./home.js');
const login = require('./login.js');
const logout = require('./logout.js');
const page = require('./page.js');
const post = require('./post.js');
const profile = require('./profile.js');
const signup = require('./signup.js');
const status = require('./status.js');
const username = require('./signup.username.js');
const user = require('./user.js');

router
	.route('/account')
	.get(mw.requiresLogin, mw.verifyUsername, account.renderSettingsMenu)

router
	.route('/account/deactivate')
	.get(mw.requiresLogin, mw.verifyUsername, account.renderDeactivate)
	.post(mw.requiresLogin, mw.verifyUsername, user.deleteUser)

router
	.route('/account/email')
	.get(mw.requiresLogin, mw.verifyUsername, account.renderEmail)
	.post(mw.requiresLogin, mw.verifyUsername, user.updateEmail)

router
	.route('/account/name')
	.get(mw.requiresLogin, mw.verifyUsername, account.renderName)
	.post(mw.requiresLogin, mw.verifyUsername, user.updateName)

router
	.route('/account/password')
	.get(mw.requiresLogin, mw.verifyUsername, account.renderPassword)
	.post(mw.requiresLogin, mw.verifyUsername, user.updatePassword)

router
	.route('/account/username')
	.get(mw.requiresLogin, mw.verifyUsername, account.renderUsername)
	.post(mw.requiresLogin, mw.verifyUsername, mw.verifyUsernameFormData, user.updateUsername)

router
	.route('/')
	.get(mw.requiresLogin, mw.verifyUsername, home.renderHome)

router
	.route('/more')
	.get(home.getMore)

router
	.route('/login')
	.get(mw.requiresLogout, login.renderLogin)
	.post(mw.requiresLogout, login.postLoginForm)

router
	.route('/logout')
	.get(mw.requiresLogin, mw.verifyUsername, logout.getLogout)

router
	.route('/signup')
	.get(mw.requiresLogout, signup.renderSignup)
	.post(mw.requiresLogout, signup.postSignupForm)

router
	.route('/signup/username')
	.get(mw.requiresLogin, username.renderUsername)
	.post(mw.requiresLogin, mw.verifyUsernameFormData, mw.reservedWords, username.postUsernameForm)

router
	.route('/status')
	.get(mw.requiresLogin, mw.verifyUsername, status.renderStatus)
	.post(mw.requiresLogin, mw.verifyUsername, mw.verifyStatusFormData, status.postStatus)


router
	.route('/:username')
	.get(mw.requiresLogin, mw.verifyUsername, profile.renderProfile)

router
	.route('/:username/posts/:postId/')
	.get(mw.requiresLogin, mw.verifyUsername, post.renderPost)
	.post(mw.requiresLogin, mw.verifyUsername, mw.verifyCommentsFormData, post.postComment)

router
	.route('*')
	.get(mw.requiresLogin, mw.verifyUsername, page.pageNotFound)


module.exports = router;
