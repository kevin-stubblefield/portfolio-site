let User = require('./models/user');
let Post = require('./models/post');
let Message = require('./models/message');
let Project = require('./models/todo/project');
let Task = require('./models/todo/task');
let Bill = require('./models/ledger/bill');
let Payment = require('./models/ledger/payment');

module.exports = {
    createUser: function(user) {
        return User.query().insert(user);
    },

    getUsers: function() {
        return User.query();
    },

    getOtherUsers: function(userId) {
        return User.query().where('id', '!=', userId);
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
        return Post.query().patchAndFetchById(postId, post);
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
        return Project.query().orderBy('created_at').eager('tasks(orderByCreatedAt)');
    },

    getProjectById: function(projectId) {
        return Project.query().findOne('id', projectId).eager('tasks(orderByCreatedAt)');
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
    },

    getBills: function(userId) {
        return Bill.query().eager('payments').where('user_id', userId);
    }
}