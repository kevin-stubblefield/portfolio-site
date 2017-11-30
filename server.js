require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var schedule = require('node-schedule');
var cookieparser = require('cookie-parser');
var utils = require('./utils.js');

var dbConfig = require('./dbConfig');

var PORT = process.env.PORT || 3000;

app.set('view engine', 'pug');

// Route and middleware config
var indexController = require('./controllers/indexController');
var blogController = require('./controllers/blogController');
var todoController = require('./controllers/todoController');
var apiController = require('./controllers/apiController');

app.use(utils.httpsRedirect);
app.use(cookieparser());
app.use('/', indexController);
app.use('/blog', blogController);
app.use('/todo', todoController);
app.use('/api', apiController);
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all 404
app.get('/*', function (req, res) {
    res.render('error', {
        title: '404',
        errorCode: 404,
        errorMessage: 'Page not found'
    });
});

schedule.scheduleJob('0 0 0 * * *', function () {
    process.env.TOKEN_SECRET = require('crypto').randomBytes(48).toString('hex');
});

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT + ' ' + __dirname);
});