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

router.get('/', utils.getUser, async function(req, res) {
    var projects = await db.getProjects();
    if (!projects) {
        return res.render('error', {
            title: '500',
            errorCode: 500,
            errorMessage: 'Server Error. Try again.'
        });
    }

    res.render('todo', {
        title: 'Project Dashboard',
        projects: projects,
        user: req.user
    });
});

router.get('/:id', async function(req, res) {
    var projectId = req.params.id;
    var project = await db.getProjectById(projectId);
    res.json(project);
});

router.post('/', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'title', 'description', 'category');

    var project = await db.createProject(body);
    res.status(200).json(project);
});

router.patch('/:id', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'title', 'description');

    var projectId = req.params.id;

    await db.patchProject(projectId, body);
});

router.delete('/:id', utils.requireAuth, async function(req, res) {
    var projectId = req.params.id;
    
    await db.deleteProject(projectId);
});

router.post('/:id', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'description');

    body.projectId = req.params.id;

    var newTask = await db.createTask(body);

    res.status(200).json(newTask);
});

router.patch('/tasks/complete/:taskId', utils.requireAuth, async function(req, res) {
    var taskId = req.params.taskId;

    await db.patchTask(taskId, { complete: true });
});

router.patch('/tasks/:taskId', utils.requireAuth, async function(req, res) {
    var body = _.pick(req.body, 'description');
    var taskId = req.params.taskId;

    await db.patchTask(taskId, body);
});

router.delete('/tasks/:taskId', utils.requireAuth, async function(req, res) {
    var taskId = req.params.taskId;

    await db.deleteTask(taskId);
});

module.exports = router;