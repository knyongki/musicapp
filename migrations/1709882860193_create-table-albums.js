/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('albums', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notnull: true,
    },
    year: {
      type: 'INT',
      notnull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('albums');
};
