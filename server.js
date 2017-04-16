require('dotenv').config();

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var path = require('path');
var ect = require('ect');
var ectRenderer = ect({ watch: true, root: __dirname + '/views/layouts', ext: '.ect' });
var mongoose = require('mongoose');

var indexRoutes = require('./routes/index.js');
var blogRoutes = require('./routes/blog.js');

var mongoDB = process.env.DB_CONNSTRING;
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var PORT = process.env.PORT || 3000;

app.set('view engine', 'ect');
app.engine('ect', ectRenderer.render);

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRoutes);
app.use('/blog', blogRoutes);
app.use(bodyParser.json());

app.listen(PORT, function () {
    console.log('Listening on port ' + PORT);
});