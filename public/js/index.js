let button = document.getElementById('fetch');
let articleArray = document.getElementsByClassName('article');

button.addEventListener('click', () => {
	fetch(`http://localhost:3000/more?skip=${articleArray.length}`)
	.then((response) => {
		return response.json()
	})
	.then((postArray) => {
		let body = document.body;

		if (postArray.length === 0) {
			let element = document.createElement("div");
			element.className = "note";
			element.innerHTML = "You have nothing else to catch up on!";
			body.insertBefore(element, button);
			body.removeChild(button);
			return;
		}

		for (i = 0; i < postArray.length; i++) {
			let element = document.createElement("article");
			element.className = "article";
			body.insertBefore(element, button);

			let markup = `<a href="/${postArray[i].profileUrl}" class="user">
							<span class="name">${postArray[i].name}</span>
							<span class="username">${postArray[i].username}</span>
						</a>
						<a href="${postArray[i].postUrl}" class="content">
							<div class="text">${postArray[i].text}</div>
							<div class="comments">
								<span class="commentsIcon"><i class="material-icons">chat_bubble_outline</i></span>
								<span class="commentsCount">${postArray[i].comments}</span>
							</div>
						</a>`;

			element.innerHTML = markup;
		}
	})
})
