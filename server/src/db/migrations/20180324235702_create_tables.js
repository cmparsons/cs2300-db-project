export function up(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('user', (table) => {
        table.increments('id').primary();
        table
          .string('username')
          .notNullable()
          .unique();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      })
      .createTable('email', (table) => {
        table
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE')
          .index();
        table.string('email').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
        table.primary(['user_id', 'email']);
      })
      .createTable('user_password', (table) => {
        table
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE')
          .index()
          .primary();
        table.string('encrypted').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
      }),
  ]);
}

export function down(knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTable('user')
      .dropTable('email')
      .dropTable('user_password'),
  ]);
}
