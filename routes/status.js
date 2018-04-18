const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports.renderStatus = (req, res) => {
	res.render('index.html', {
		title : 'Status Update | New Status',
		stylesheet : '/css/stylesheet.css',
		partial : 'partials/status.html'
	});
}

module.exports.postStatus = (req, res) => {
	let newPost = new Post({
		user : req.session.userId,
		text : req.body.text
	});

	newPost
		.save()
		.then((doc) => {
			res.redirect('/');
		})
		.catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'status.js';
      err.partial = 'status';
      err.route = 'New Status'
      err.status = 500;
      return next(err);
		})
}
