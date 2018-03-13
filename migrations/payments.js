exports.up = function(knex) {
    return knex.schema
        .createTable('payments', function(table) {
            table.increments().primary();
            table.integer('bill_id').references('bills.id').onDelete('cascade');
            table.decimal('amount', 17, 2).notNullable().defaultTo(0).index();
            table.integer('paid_by').notNullable().references('users.id').onDelete('cascade');
            table.integer('paid_to').notNullable().references('users.id').onDelete('cascade');
            table.string('status').notNullable().defaultTo('Unpaid');
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('payments');
}