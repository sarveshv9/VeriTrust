const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middleware");
const authController = require("../controllers/auth-controllers");
const profileController = require("../controllers/profileController");
const reviewController = require("../controllers/reviewController");
const blockchain = require("../blockchain");

// Health + chain info
router.get("/", (req, res) => {
  res.json({ message: "Gig Reputation API", chain: blockchain.getChainInfo() });
});

// Auth
router.post("/register", authController.register);
router.post("/login", authController.login);

// Profiles
router.post("/profile", requireAuth, profileController.onCreate);
router.put("/profile", requireAuth, profileController.onUpdate);
router.get("/profile/:publicKey", profileController.onGet);
router.get("/profiles/count", profileController.onCount);

// Reviews
router.post("/review", requireAuth, reviewController.onPost);
router.get("/reviews/:publicKey", reviewController.onGet);

module.exports = router;
