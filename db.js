var User = require('./models/user');
var Post = require('./models/post');
var Message = require('./models/message');
var Project = require('./models/todo/project');
var Task = require('./models/todo/task');

module.exports = {
    createUser: function(user) {
        return User.query().insert(user);
    },

    getUsers: function() {
        return User.query();
    },

    getUserByUsername: function(username) {
        return User.query().findOne('username', username);
    },

    createPost: function(post) {
        return Post.query().insert(post);
    },

    getPosts: function() {
        return Post.query().eager('messages');
    },

    getPostById: function(postId) {
        return Post.query().findOne('id', postId).eager('messages');
    },

    createMessage: function(message) {
        return Message.query().insert(message);
    },

    getMessagesForPost: function(postId) {
        return Message.query().where('post_id', postId);
    },

    createProject: function(project) {
        return Project.query().insert(project);
    },

    getProjects: function() {
        return Project.query().eager('tasks');
    },

    createTask: function(task) {
        return Task.query().insert(task);
    },

    deleteTask: function(taskId) {
        return Task.query().deleteById(taskId);
    },

    patchTask: function(taskId, task) {
        return Task.query().patch(task).where('id', taskId);
    }
}