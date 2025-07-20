/* eslint-disable camelcase */
const mapDBToAlbumModel = ({
  id,
  name,
  year,
}) => ({
  id,
  name,
  year,
});

const mapDBToSongModel = ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  album_id,
}) => ({
  id,
  title,
  year,
  genre,
  performer,
  duration,
  albumId: album_id,
});

const mapDBToPlaylistModel = ({
  id,
  name,
  owner,
}) => ({
  id,
  name,
  username: owner,
});

module.exports = { mapDBToAlbumModel, mapDBToSongModel, mapDBToPlaylistModel };
