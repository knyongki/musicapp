/* eslint-disable max-len */
const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  register: (server, {
    service, playlistService, userService, validator,
  }) => {
    const collaborationsHandler = new CollaborationsHandler(service, playlistService, userService, validator);
    server.route(routes(collaborationsHandler));
  },
};
