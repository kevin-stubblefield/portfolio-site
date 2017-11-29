var knex = require('knex')(require('./knexfile')[process.env.NODE_ENV || 'development']);
var objection = require('objection');
var Model = objection.Model;
Model.knex(knex);

module.exports = {
    objection: objection,
    Model: Model
}