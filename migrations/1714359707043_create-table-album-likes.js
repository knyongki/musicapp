/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('album_likes', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      reference: 'albums',
      onDelete: 'cascade',
    },
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
      reference: 'users',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};
