const mongoose = require("mongoose");

const albumSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    coverImage: {
      type: String,
      default: "",
      trim: true,
    },

    musics: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Music",
      },
    ],

    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Album", albumSchema);