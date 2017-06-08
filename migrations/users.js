exports.up = function(knex) {
    return knex.schema
        .createTable('users', function(table) {
            table.increments().primary();
            table.string('username').notNullable().unique().index();
            table.string('password').notNullable();
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('users');
}