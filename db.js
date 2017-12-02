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
        return Post.query().orderBy('created_at', 'desc').eager('messages');
    },

    getPostById: function(postId) {
        return Post.query().findOne('id', postId).eager('messages');
    },

    getPostByUrl: function(url) {
        return Post.query().findOne('url', url).eager('messages');
    },

    patchPost: function(postId, post) {
        return Post.query().patch(post).where('id', postId);
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
    
    patchProject: function(projectId, project) {
        return Project.query().patch(project).where('id', projectId);
    },

    deleteProject: function(projectId) {
        return Project.query().deleteById(projectId);
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