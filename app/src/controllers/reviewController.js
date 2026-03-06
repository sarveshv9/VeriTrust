const blockchain = require("../blockchain");

const reviewController = {
  // POST /review  (no auth required — anyone can review a freelancer)
  onPost: async (req, res) => {
    try {
      const { subjectKey, rating, comment, reviewerName } = req.body;

      if (!subjectKey || !rating || !comment) {
        return res.status(400).json({
          success: false,
          message: "subjectKey, rating, and comment are required",
        });
      }
      if (rating < 1 || rating > 5) {
        return res
          .status(400)
          .json({ success: false, message: "Rating must be 1 to 5" });
      }

      // Subject must have a profile
      const subject = blockchain.getProfile(subjectKey);
      if (!subject) {
        return res
          .status(404)
          .json({ success: false, message: "Subject profile not found" });
      }

      const block = blockchain.addTransaction({
        type: "POST_REVIEW",
        subjectKey,
        reviewerName: (reviewerName || "Anonymous").slice(0, 100),
        rating: Number(rating),
        comment: comment.slice(0, 1000), // max 1000 chars
      });

      res.status(201).json({
        success: true,
        message: "Review added to blockchain",
        blockIndex: block.index,
        blockHash: block.hash,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /reviews/:publicKey?offset=0&limit=10  (public)
  onGet: async (req, res) => {
    try {
      const { publicKey } = req.params;
      const offset = parseInt(req.query.offset) || 0;
      const limit = parseInt(req.query.limit) || 10;

      const profile = blockchain.getProfile(publicKey);
      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }

      const all = blockchain.getReviews(publicKey);
      const paged = all.slice(offset, offset + limit);

      res.status(200).json({
        success: true,
        total: all.length,
        offset,
        limit,
        data: paged,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = reviewController;
