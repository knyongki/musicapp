class AlbumsHandler {
  constructor(service, storageService, validator) {
    this._service = service;
    this._storageService = storageService;
    this._validator = validator;

    this.postAlbumHandler = this.postAlbumHandler.bind(this);
    this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
    this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
    this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    this.postAlbumCoverHandler = this.postAlbumCoverHandler.bind(this);
    this.postLikeAlbumHandler = this.postLikeAlbumHandler.bind(this);
    this.getLikesAlbumHandler = this.getLikesAlbumHandler.bind(this);
    this.deleteLikeAlbumHandler = this.deleteLikeAlbumHandler.bind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album berhasil ditambahkan',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { id } = request.params;
    const album = await this._service.getAlbumById(id);
    return {
      status: 'success',
      data: {
        album,
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;

    await this._service.editAlbumById(id, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postAlbumCoverHandler(request, h) {
    const { id } = request.params;
    const { cover } = request.payload;
    console.log(id);
    this._validator.validateAlbumCoverHeaders(cover.hapi.headers);
    console.log('p');

    const filename = await this._storageService.writeFile(cover, cover.hapi);
    const url = `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`;
    await this._service.editAlbumCoverById(id, url);

    const response = h.response({
      status: 'success',
      message: 'Sampul berhasil diunggah',
    });
    response.code(201);
    return response;
  }

  async postLikeAlbumHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.getAlbumById(id);
    await this._service.addLikeAlbum(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Album disukai',
    });
    response.code(201);
    return response;
  }

  async getLikesAlbumHandler(request) {
    const { id } = request.params;
    const likes = await this._service.getLikesAlbum(id);
    return {
      status: 'success',
      data: {
        likes,
      },
    };
  }

  async deleteLikeAlbumHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteLikeAlbum(id, credentialId);

    return {
      status: 'success',
      message: 'Berhasil batal menyukai album',
    };
  }
}

module.exports = AlbumsHandler;
