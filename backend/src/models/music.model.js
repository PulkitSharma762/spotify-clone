const mongoose = require("mongoose");

const musicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    artist: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    uri: {
      type: String,
      required: true,
      trim: true,
    },

    coverImage: {
      type: String,
      default: "",
      trim: true,
    },

    duration: {
      type: Number,
      default: 0,
      min: 0,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Music", musicSchema);