const ImageKit = require("@imagekit/nodejs");
const { toFile } = require("@imagekit/nodejs");

let imageKitClient;

function getImageKitClient() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is missing from .env");
  }

  if (!imageKitClient) {
    imageKitClient = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }

  return imageKitClient;
}

async function uploadFile(
  fileBuffer,
  fileName,
  folder = "SPOTIFY_CLONE/music"
) {
  const imageKit = getImageKitClient();

  const file = await toFile(fileBuffer, fileName);

  const result = await imageKit.files.upload({
    file,
    fileName,
    folder,
  });

  return result;
}

module.exports = {
  uploadFile,
};