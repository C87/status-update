// --- Connect to Database ---
let mongoose = require('mongoose');
let dbUrl = 'mongodb://localhost/statusUpdate';

mongoose.connect(dbUrl)
.then(() => {
	console.log('Connected:', dbUrl)
}).catch((err) => {
	console.log('DB Connection Error:', err.message);
});

// -- Require in Models ---
require('./models');

// --- Initalise Express and Express-Session ---
let express = require('express');
let session = require('express-session')
let app = express();

// --- Initalise Mongo Store ---
let MongoStore = require('connect-mongo')(session);

// --- Define Session and Session Store ---
app.use(session({
	secret: ,
	resave: false,
	saveUninitialized: true,
	store: new MongoStore({
		mongooseConnection: mongoose.connection
	})
}));

// --- Initalise Body Parser ---
let bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

// --- Serve Static Assets ---
let path = require('path');
app.use(express.static(path.join(__dirname + '/public')));

// --- Nunjucks Configuartion ---
let nunjucks = require('nunjucks');
nunjucks.configure('views', {
	express: app
});

// --- Require in Routes ---
let router = require('./routes');

// --- Use Router Middleware ---
app.use(router);

// --- Error Handling Middleware ---
app.use((err, req, res, next) => {
	console.log(`Error: ${err.message} @ ${err.fileName}`);
  res
    .status(err.status || 500)
    .render('index.html', {
      title : `Status Update | ${err.route}`,
      stylesheet : '/css/stylesheet.css',
      partial : `partials/${err.partial}.html`,
      notice : err.message,
    });
})

// -- Listen for Connection on Port 3000 --
app.listen(3000, () => {
	console.log('Listening on Port 3000');
});
