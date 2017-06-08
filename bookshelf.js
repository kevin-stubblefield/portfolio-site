var knex = require('knex')(require('./knexfile.js')[process.env.NODE_ENV || 'development']);

var bookshelf = require('bookshelf')(knex);
bookshelf.plugin(['virtuals', 'bookshelf-camelcase']);

module.exports = bookshelf;