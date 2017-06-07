exports.up = function(knex) {
    return knex.schema
        .createTable('posts', function(table) {
            table.increments().primary();
            table.string('title').notNullable();
            table.text('markdown_content').notNullable();
            table.text('html_content').notNullable();
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('posts');
}