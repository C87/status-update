const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports.renderHome = (req, res, next) => {
	Post
		.find()
		.sort({
			date : -1
		})
		.limit(5)
		.populate('user', 'name username')
		.then((post) => {
			let postArray = [];
			for (let i in post) {
				let content = {
					name : post[i].user.name,
					username : post[i].user.username,
					text : post[i].text,
					comments : post[i].comments.length,
					profileUrl: `/${post[i].user.username}`,
					postUrl : `/${post[i].user.username}/posts/${post[i]._id}`
				}
				postArray.push(content);
			}
			res.render('index.html', {
				title : 'Status Update',
				stylesheet : '/css/stylesheet.css',
				partial : 'partials/home.html',
				array : postArray,
				script : '/js/index.js'
			});
		})
		.catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'home.js';
      err.partial = 'home';
      err.route = 'Home'
      err.status = 500;
      return next(err);
		})
}

module.exports.getMore = (req, res) => {
	let skip = parseInt(req.query.skip);

	Post
		.find()
		.sort({
			date : -1
		})
		.skip(skip)
		.limit(5)
		.populate('user', 'name username')
		.then((post) => {
			if (post.length === 0) {
				return res.send([]);
			}
			let postArray = [];
			for (let i in post) {
				let content = {
					name : post[i].user.name,
					username : post[i].user.username,
					text : post[i].text,
					comments : post[i].comments.length,
					profileUrl: `/${post[i].user.username}`,
					postUrl : `/${post[i].user.username}/posts/${post[i]._id}`
				}
				postArray.push(content);
			}
			res.json(postArray);
		})
		.catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'home.js';
      err.partial = 'home';
      err.route = 'Home'
      err.status = 500;
      return next(err);
		})
}
