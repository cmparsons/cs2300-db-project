export function up(knex, Promise) {
  return Promise.all([
    knex.schema
      .createTable('user', (table) => {
        table.increments('id').primary();
        table
          .string('username')
          .notNullable()
          .unique();
        table.timestamps(true, true);
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
        table
          .string('email')
          .notNullable()
          .unique();
        table.timestamps(true, true);
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
        table.timestamps(true, true);
      })
      .createTable('message', (table) => {
        table.increments('id').primary();
        table.string('body');
        table
          .integer('sender_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE')
          .index();
        table
          .integer('receiver_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE')
          .index();
        table.timestamps(true, true);
      })
      .createTable('community', (table) => {
        table.increments('id').primary();
        table.string('name').notNullable();
        table
          .integer('creator_id')
          .unsigned()
          .references('id')
          .inTable('user')
          .onDelete('SET NULL')
          .index();
        table.timestamps(true, true);
      })
      .createTable('post', (table) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('body').notNullable();
        table
          .integer('community_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('community')
          .onDelete('CASCADE')
          .index();
        table
          .integer('poster_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE')
          .index();
        table.timestamps(true, true);
      })
      .createTable('image_post', (table) => {
        table
          .integer('post_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('post')
          .onDelete('CASCADE')
          .index()
          .primary();
        table
          .string('url')
          .notNullable()
          .unique();
        table.string('type').notNullable();
        table.timestamps(true, true);
      })
      .createTable('comment', (table) => {
        table.integer('comment_id').notNullable();
        table
          .integer('post_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('post')
          .onDelete('CASCADE')
          .index();
        table.string('body').notNullable();
        table
          .integer('user_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('user')
          .onDelete('CASCADE')
          .index();
        table.primary(['post_id', 'comment_id']);
        table.timestamps(true, true);
      }),
  ]);
}

export function down(knex, Promise) {
  return Promise.all([
    knex.schema
      .dropTableIfExists('email')
      .dropTableIfExists('user_password')
      .dropTableIfExists('message')
      .dropTableIfExists('comment')
      .dropTableIfExists('image_post')
      .dropTableIfExists('post')
      .dropTableIfExists('community')
      .dropTableIfExists('user'),
  ]);
}
