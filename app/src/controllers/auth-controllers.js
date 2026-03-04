const {
  initializeKeys,
  generateKeys, // change
  getPrivateKey,
  getPublicKey,
} = require("./utils/key-utils");

const crypto = require("crypto"); // change

const auth_controllers = {
  register: async (req, res) => {
    try {
      // Temporarily use direct generation since generateKeys returns nothing
      // We'll return full details generated here and let key-utils handle disk writes separately if needed.
      const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: "spki", format: "pem" },
        privateKeyEncoding: { type: "pkcs8", format: "pem" },
      });
      res.json({
        Message: "Keys Generated",
        "publicKey": publicKey,
        "privateKey": privateKey,
        WARNING:
          "Store your private key securely, if lost, your data will be lost too",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  login: async (req, res) => {
    try {
      const { private_key } = req.body;

      if (!private_key) {
        return res.status(400).json({ message: "Private key is required" });
      }

      // Validate the private key and derive the public key from it
      let publicKeyPem;
      try {
        const sign = crypto.createSign('SHA256');
        sign.update('test_message');
        sign.sign(private_key, 'hex');

        // Derive the public key from the private key
        const publicKeyObj = crypto.createPublicKey(private_key);
        publicKeyPem = publicKeyObj.export({ type: 'spki', format: 'pem' });
      } catch (keyError) {
        return res.status(401).json({ message: "Invalid private key format. Authentication failed." });
      }

      // Valid key — issue JWT with publicKey in the payload
      // Use the same secret as middleware.js
      const jwt = require("jsonwebtoken");
      const JWT_SECRET = process.env.JWT_SECRET || "changeme";
      const token = jwt.sign(
        { publicKey: publicKeyPem, role: "freelancer", authenticated_at: Date.now() },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        message: "Login successful",
        token: token,
        user: { role: "freelancer", publicKey: publicKeyPem }
      });

    } catch (error) {
      res.status(500).json({ message: "Internal server error during login", error: error.message });
    }
  }
};

module.exports = auth_controllers;
