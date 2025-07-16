class SongsHandler {
  constructor(service, validator) {
    this.service = service;
    this.validator = validator;

    this.postSongHandler = this.postSongHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongsHandler = this.getSongsHandler.bind(this);
    this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
    this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
    this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
  }

  async postSongHandler(request, h) {
    this.validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration = null, albumId = null,
    } = request.payload;
    const songId = await this.service.addSong({
      title, year, genre, performer, duration, albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title = null, performer = null } = request.query;
    let filteredSong = await this.service.getSongs();

    if (title !== null) {
      filteredSong = filteredSong.filter(
        (song) => song.title.toLowerCase().includes(title.toLowerCase()),
      );
    }

    if (performer !== null) {
      filteredSong = filteredSong.filter(
        (song) => song.performer.toLowerCase().includes(performer.toLowerCase()),
      );
    }
    return {
      status: 'success',
      data: {
        songs: filteredSong,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;

    const song = await this.service.getSongById(id);

    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this.validator.validateSongPayload(request.payload);
    const { id } = request.params;
    const {
      title, year, genre, performer, duration = null, albumId = null,
    } = request.payload;

    await this.service.editSongById(id, {
      title, year, genre, performer, duration, albumId,
    });
    return {
      status: 'success',
      message: 'Song berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this.service.deleteSongById(id);
    return {
      status: 'success',
      message: 'Song berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
