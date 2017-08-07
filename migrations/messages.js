exports.up = function(knex) {
    return knex.schema
        .createTable('messages', function(table) {
            table.increments().primary();
            table.integer('post_id').unsigned().notNullable().references('posts.id');
            table.text('content').notNullable();
            table.string('name');
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('messages');
}