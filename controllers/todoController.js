var express = require('express');
var router = express.Router();
var _ = require('lodash');
var db = require('../db');
var utils = require('../utils');
var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/', async function(req, res) {
    var projects = await db.getProjects();
    if (!projects) {
        return res.render('error', {
            title: '500',
            errorCode: 500,
            errorMessage: 'Server Error. Try again.'
        });
    }

    res.render('todo', {
        title: 'My Todo List',
        projects: projects
    });
});

router.post('/', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'title', 'description', 'category');

    await db.createProject(body);
});

module.exports = router;