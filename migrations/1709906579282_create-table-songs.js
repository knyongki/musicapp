/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('songs', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'TEXT',
      notnull: true,
    },
    year: {
      type: 'INT',
      notnull: true,
    },
    performer: {
      type: 'VARCHAR(50)',
      notnull: true,
    },
    genre: {
      type: 'VARCHAR(50)',
      notnull: true,
    },
    duration: {
      type: 'INT',
      notnull: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: false,
      references: '"albums"',
      onDelete: 'cascade',
    },
  });

  pgm.createIndex('songs', 'album_id');
};

exports.down = (pgm) => {
  pgm.dropTable('songs');
};
