require('newrelic');
require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var schedule = require('node-schedule');
var cookieparser = require('cookie-parser');
var utils = require('./utils.js');

var PORT = process.env.PORT || 3000;

// View Engine config
var ect = require('ect');
var ectRenderer = ect({
    watch: true,
    root: __dirname + '/views/layouts',
    ext: '.ect'
});

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

// Route and middleware config
var indexRoutes = require('./routes/index.js');
var blogRoutes = require('./routes/blog.js');
var apiRoutes = require('./routes/api.js');

app.use(utils.httpsRedirect);
app.use(cookieparser());
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'public')));

// Catch-all 404
app.get('/*', function (req, res) {
    res.render('error', {
        title: '404',
        errorCode: 404,
        errorMessage: 'Page not found'
    });
});

schedule.scheduleJob('0 0 17 * * 0', function () {
    process.env.TOKEN_SECRET = require('crypto').randomBytes(48).toString('hex');
});

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT + ' ' + __dirname);
});