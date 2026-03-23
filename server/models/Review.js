/**
 * Mongoose model for visitor reviews on the portfolio.
 * Each document stores an optional display name, required comment text,
 * and automatic creation timestamp for sorting and relative time display.
 */

const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    default: "Anonymous",
    trim: true,
  },
  comment: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", reviewSchema);
