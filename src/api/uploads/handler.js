class UploadsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    this.postUploadCoverHandler = this.postUploadCoverHandler.bind(this);
  }

  async postUploadCoverHandler(request, h) {
    const { data } = request.payload;
    this._validator.validateCoverHeaders(data.hapi.headers);
    // const { id } = request.params;

    const filename = await this._service.writeFile(data, data.hapi);
    // await this._service.updatePlaylistCover(id, filename);

    const response = h.response({
      status: 'success',
      data: {
        fileLocation: `http://${process.env.HOST}:${process.env.PORT}/upload/images/${filename}`,
      },
    });
    response.code(201);
    return response;
  }
}

module.exports = UploadsHandler;
