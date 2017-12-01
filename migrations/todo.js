exports.up = function(knex) {
    return knex.schema
        .createTable('projects', function(table) {
            table.increments().primary();
            table.string('title').notNullable();
            table.text('description').notNullable().defaultTo('');
            table.integer('progress').notNullable().defaultTo(0);
            table.string('category').notNullable().defaultTo('development');
            table.date('eta');
            table.timestamps(true, true);
        })
        .createTable('tasks', function(table) {
            table.increments().primary();
            table.integer('project_id').unsigned().notNullable().references('projects.id');
            table.string('description');
            table.string('category').notNullable().defaultTo('feature');
            table.boolean('complete').notNullable().defaultTo(false);
            table.integer('weight').notNullable().defaultTo(0);
            table.decimal('hours_spent', 17, 2).notNullable().defaultTo(0);
            table.timestamps(true, true);
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTable('tasks').dropTable('projects');
}