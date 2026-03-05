const crypto = require("crypto");
const blockchain = require("../blockchain");

const profileController = {
  // POST /profile  (auth required)
  onCreate: async (req, res) => {
    try {
      const { publicKey } = req.user;
      const { name, occupation, location, contact } = req.body;

      if (!name || !occupation) {
        return res
          .status(400)
          .json({
            success: false,
            message: "name and occupation are required",
          });
      }

      // Check not already registered
      const existing = blockchain.getProfile(publicKey);
      if (existing) {
        return res
          .status(409)
          .json({ success: false, message: "Profile already exists" });
      }

      // Hash contact info — raw data stays off-chain
      const contactHash = contact
        ? crypto.createHash("sha256").update(contact).digest("hex")
        : null;

      const block = blockchain.addTransaction({
        type: "REGISTER_PROFILE",
        publicKey,
        name,
        occupation,
        location: location || "",
        contactHash,
      });

      res.status(201).json({
        success: true,
        message: "Profile added to blockchain",
        blockIndex: block.index,
        blockHash: block.hash,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // PUT /profile  (auth required)
  onUpdate: async (req, res) => {
    try {
      const { publicKey } = req.user;
      const { name, occupation, location, contact } = req.body;

      if (!name || !occupation) {
        return res
          .status(400)
          .json({
            success: false,
            message: "name and occupation are required",
          });
      }

      const existing = blockchain.getProfile(publicKey);
      if (!existing) {
        return res
          .status(404)
          .json({
            success: false,
            message: "Profile not found — register first",
          });
      }

      const contactHash = contact
        ? crypto.createHash("sha256").update(contact).digest("hex")
        : null;

      const block = blockchain.addTransaction({
        type: "UPDATE_PROFILE",
        publicKey,
        name,
        occupation,
        location: location || "",
        contactHash,
      });

      res.status(200).json({
        success: true,
        message: "Profile updated on blockchain",
        blockIndex: block.index,
        blockHash: block.hash,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /profile/:publicKey  (public)
  onGet: async (req, res) => {
    try {
      const { publicKey } = req.params;
      const profile = blockchain.getProfile(publicKey);

      if (!profile) {
        return res
          .status(404)
          .json({ success: false, message: "Profile not found" });
      }

      const reviews = blockchain.getReviews(publicKey);
      const avg = reviews.length
        ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(2)
        : null;

      res.status(200).json({
        success: true,
        data: {
          name: profile.name,
          occupation: profile.occupation,
          location: profile.location,
          contactHash: profile.contactHash,
          registeredAt: profile.timestamp,
          blockIndex: profile.blockIndex,
          reviewCount: reviews.length,
          averageRating: avg ? parseFloat(avg) : null,
        },
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /profiles/count  (public)
  onCount: async (req, res) => {
    try {
      res
        .status(200)
        .json({ success: true, totalProfiles: blockchain.totalProfiles() });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  // GET /profiles  (public)
  onGetAll: async (req, res) => {
    try {
      const { search } = req.query;
      let profiles = blockchain.getAllProfiles();

      if (search) {
        const lowerSearch = search.toLowerCase();
        profiles = profiles.filter(
          (p) =>
            (p.name && p.name.toLowerCase().includes(lowerSearch)) ||
            (p.occupation && p.occupation.toLowerCase().includes(lowerSearch))
        );
      }

      res.status(200).json({
        success: true,
        data: profiles,
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },
};

module.exports = profileController;
