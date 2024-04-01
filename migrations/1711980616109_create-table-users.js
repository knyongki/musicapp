/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('users', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    username: {
      type: 'VARCHAR(50)',
      notnull: true,
    },
    fullname: {
      type: 'TEXT',
      notnull: true,
    },
    password: {
      type: 'TEXT',
      notnull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('users');
};
