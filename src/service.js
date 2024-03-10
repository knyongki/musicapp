require('dotenv').config();

const Hapi = require('@hapi/hapi');

// albums
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/albumsService');

// songs
const songs = require('./api/songs');
const SongsService = require('./services/postgres/songsService');

const init = async () => {
  const songsService = new SongsService();
  const albumsService = new AlbumsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
