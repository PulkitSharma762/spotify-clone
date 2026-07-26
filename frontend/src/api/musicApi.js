import api from "./axios";

export const getAllSongs = () => {
  return api.get("/music");
};

export const getAlbums = () => {
  return api.get("/music/albums");
};

export const getAlbum = (id) => {
  return api.get(`/music/albums/${id}`);
};

export const uploadSong = (formData) => {
  return api.post("/music/upload", formData);
};

export const createAlbum = (formData) => {
  return api.post("/music/album", formData);
};