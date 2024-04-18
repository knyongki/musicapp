class CollaborationsHandler {
  constructor(service, playlistService, userService, validator) {
    this._service = service;
    this._playlistService = playlistService;
    this._usersService = userService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  async postCollaborationHandler(request, h) {
    this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._usersService.getUserById(userId);
    const collaborationId = await this._service.addCollaboration({ playlistId, userId });

    const response = h.response({
      status: 'success',
      message: 'Palylist berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });

    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this._validator.validateCollaborationPayload(request.payload);
    const { playlistId, userId } = request.payload;
    const { id: credentialId } = request.auth.credentials;

    await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deleteCollaboration({ playlistId, userId });

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
