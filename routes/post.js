const mongoose = require('mongoose');
const Post = mongoose.model('Post');

module.exports.renderPost = (req, res, next) => {
	let postId = req.params.postId;

	Post
		.findById(postId)
		.populate('user', 'name username')
		.populate('comments.user', 'name username')
		.then((post) => {
			if (!post) {
        let err = new Error('Page Not Found');
        err.fileName = 'post.js';
        err.partial = 'error';
        err.route = '404'
        err.status = 404;
        return next(err);
			}

			let user = post.user.name;
			let username = post.user.username;
			let text = post.text;
			let comments = post.comments;
			let commentsArray = [];

			for (i = 0; i < comments.length; i ++) {
					let comment = {
						name : comments[i].user.name,
						username : comments[i].user.username,
						text : comments[i].text
					}
					commentsArray.push(comment);
				}
				res.render('index.html', {
					title : `Status Update | ${username}`,
					stylesheet : '/css/stylesheet.css',
					partial : 'partials/article.html',
					user : user,
					username : username,
					text : text,
					comments : commentsArray
				});
		})
		.catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'post.js';
      err.partial = 'error';
      err.route = 'Error'
      err.status = 500;
      return next(err);
		})
}


module.exports.postComment = (req, res) => {
	let postId = req.params.postId;
	let userId = req.session.userId;
	let comment = req.body.comment;

	let newComment = {
		user : userId,
		text : comment
	}

	Post
		.findById(postId)
		.then((doc) => {
			doc.comments.push(newComment);
			doc
				.save()
				.then((updatedPost) => {

					Post
						.findById(updatedPost._id)
						.populate('user', 'name username')
						.populate('comments.user', 'name username')
						.then((post) => {
							let user = post.user.name;
							let username = post.user.username;
							let text = post.text;
							let comments = post.comments;
							let commentsArray = [];

							for (i = 0; i < comments.length; i ++) {
									let comment = {
										name : comments[i].user.name,
										username : comments[i].user.username,
										text : comments[i].text
									}
									commentsArray.push(comment);
							}

							res.render('index.html', {
								title : `Status Update | ${user}`,
								stylesheet : '/css/stylesheet.css',
								partial : 'partials/article.html',
								user : user,
								username : username,
								text : text,
								comments : commentsArray
							});
						})

				})
		})
    .catch((err) => {
      err.message = 'Internal Server Error';
      err.fileName = 'post.js';
      err.partial = 'Error';
      err.route = 'Error'
      err.status = 500;
      return next(err);
    })
}
