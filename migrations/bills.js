exports.up = function(knex) {
    return knex.schema
        .createTable('bills', function(table) {
            table.increments().primary();
            table.integer('user_id').notNullable().index().references('users.id').onDelete('cascade');
            table.decimal('amount', 17, 2).notNullable().defaultTo(0).index();
            table.string('category').notNullable().defaultTo('None');
            table.string('image_url').notNullable().defaultTo('');
            table.bool('paid').notNullable().defaultTo(false);
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('bills');
}