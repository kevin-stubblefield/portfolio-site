require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var ect = require('ect');
var ectRenderer = ect({ watch: true, root: __dirname + '/views/layouts', ext: '.ect' });
var mongoose = require('mongoose');
var schedule = require('node-schedule');
var cookieparser = require('cookie-parser');

var indexRoutes = require('./routes/index.js');
var blogRoutes = require('./routes/blog.js');
var apiRoutes = require('./routes/api.js');

var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var PORT = process.env.PORT || 3000;

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

app.use(cookieparser());
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);
app.use('/api', apiRoutes);
app.use(express.static(path.join(__dirname, 'public')));

schedule.scheduleJob('0 0 17 * * 0', function () {
    process.env.TOKEN_SECRET = require('crypto').randomBytes(48).toString('hex');
});

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});