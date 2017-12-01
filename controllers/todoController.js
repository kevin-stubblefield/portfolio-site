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

    var user = utils.getUser(req.cookies.token) || {};

    res.render('todo', {
        title: 'My Todo List',
        projects: projects,
        user: user
    });
});

router.post('/', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'title', 'description', 'category');

    await db.createProject(body);
});

router.post('/:id', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'description');

    body.projectId = req.params.id;

    await db.createTask(body);
});

router.delete('/tasks/:taskId', utils.requireAuth, async function(req, res) {
    var taskId = req.params.taskId;

    await db.deleteTask(taskId);
});

module.exports = router;