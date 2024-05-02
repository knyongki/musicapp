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

  pgm.addConstraint(
    'album_likes', // nama tabel
    'fk-album_likes.user_id-users.id', // nama constraint / nama relasi
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE', // constraint
  );
};

exports.down = (pgm) => {
  pgm.dropTable('album_likes');
};
