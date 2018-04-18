const mongoose = require('mongoose');
const User = mongoose.model('User');
const Post = mongoose.model('Post');

module.exports.renderProfile = (req, res, next) => {
	let username = req.params.username;
	let postArray = [];

	User
		.findOne({
			username : username
		})
		.then((user) => {
			if (!user) {
        let err = new Error('Page Not Found');
        err.fileName = 'profile.js';
        err.partial = 'error';
        err.route = '404'
        err.status = 404;
        return next(err);
			}

			Post
				.find({
					user : user._id
				})
        .sort({
    			date : -1
    		})
				.populate('user', 'name username')
				.then((posts) => {
					for (i = 0; i < posts.length; i++) {
						let postObj = {
							name : posts[i].user.name,
							username : posts[i].user.username,
							text : posts[i].text,
							comments : posts[i].comments.length,
							postUrl : `/${posts[i].user.username}/posts/${posts[i]._id}`
						}
						postArray.push(postObj);
					}
					res.render('index.html', {
						title : `Status Update | ${username}`,
						stylesheet : '/css/stylesheet.css',
						partial : 'partials/profile.html',
						name : user.name,
						username : user.username,
						posts : postArray
					});
				})
				.catch((err) => {
          err.message = 'Internal Server Error';
          err.fileName = 'profile.js';
          err.partial = 'error';
          err.route = 'Error'
          err.status = 500;
          return next(err);
				})
		})
		.catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'profile.js';
      err.partial = 'error';
      err.route = 'Error'
      err.status = 500;
      return next(err);
		})
}
