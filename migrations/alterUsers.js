exports.up = function(knex) {
    return knex.schema
        .alterTable('users', function(table) {
            table.string('display_name').notNullable().defaultTo('');
            table.string('role').notNullable().defaultTo(0);
        });
};

exports.down = function(knex) {
    return knex.schema
        .alterTable('users', function(table) {
            table.dropColumn('display_name');
            table.dropColumn('role');
        });
}