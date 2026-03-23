/**
 * REST routes for reviews under /api/reviews.
 * All responses follow { success, data, message } for predictable client handling.
 */

const express = require("express");
const Review = require("../models/Review");

const router = express.Router();

/**
 * POST /api/reviews
 * Body: { name?: string, comment: string }
 * Validates comment presence, persists to MongoDB, returns 201 with saved document.
 */
router.post("/", async (req, res) => {
  try {
    const { name, comment } = req.body;

    if (comment === undefined || comment === null || String(comment).trim() === "") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Comment is required",
      });
    }

    const review = new Review({
      name: name && String(name).trim() ? String(name).trim() : "Anonymous",
      comment: String(comment).trim(),
    });

    const saved = await review.save();

    return res.status(201).json({
      success: true,
      data: saved,
      message: "Review created successfully",
    });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Failed to save review",
    });
  }
});

/**
 * GET /api/reviews
 * Returns all reviews sorted newest first (createdAt descending).
 */
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      success: true,
      data: reviews,
      message: "Reviews fetched successfully",
    });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch reviews",
    });
  }
});

module.exports = router;
