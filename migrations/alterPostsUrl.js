exports.up = function(knex) {
    return knex.schema
        .alterTable('posts', function(table) {
            table.string('url').notNullable().defaultTo('');
            table.index('url');
        });
};

exports.down = function(knex) {
    return knex.schema
        .alterTable('posts', function(table) {
            table.dropColumn('url');
        });
}