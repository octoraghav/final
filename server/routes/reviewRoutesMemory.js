/**
 * Same REST contract as reviewRoutes.js, but stores reviews in process memory.
 * Used when SKIP_MONGO is set — handy for frontend-only work without MongoDB.
 * Data is lost when the server restarts.
 */

const express = require("express");

const router = express.Router();

/** @type {{ _id: string, name: string, comment: string, createdAt: Date }[]} */
const reviews = [];
let idSeq = 1;

/**
 * POST /api/reviews
 */
router.post("/", (req, res) => {
  try {
    const { name, comment } = req.body;

    if (comment === undefined || comment === null || String(comment).trim() === "") {
      return res.status(400).json({
        success: false,
        data: null,
        message: "Comment is required",
      });
    }

    const doc = {
      _id: String(idSeq++),
      name: name && String(name).trim() ? String(name).trim() : "Anonymous",
      comment: String(comment).trim(),
      createdAt: new Date(),
    };

    reviews.unshift(doc);

    return res.status(201).json({
      success: true,
      data: doc,
      message: "Review created successfully",
    });
  } catch (err) {
    console.error("POST /api/reviews (memory) error:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Failed to save review",
    });
  }
});

/**
 * GET /api/reviews — newest first
 */
router.get("/", (req, res) => {
  try {
    const sorted = [...reviews].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return res.status(200).json({
      success: true,
      data: sorted,
      message: "Reviews fetched successfully",
    });
  } catch (err) {
    console.error("GET /api/reviews (memory) error:", err);
    return res.status(500).json({
      success: false,
      data: null,
      message: "Failed to fetch reviews",
    });
  }
});

module.exports = router;
