const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

const CHAIN_FILE = path.join(__dirname, "db/chain.json");

// ─── Block ────────────────────────────────────────────────────────────────────

function createBlock(index, previousHash, transactions) {
  const timestamp = Date.now();
  const hash = computeHash(index, previousHash, timestamp, transactions);
  return { index, timestamp, previousHash, hash, transactions };
}

function computeHash(index, previousHash, timestamp, transactions) {
  const data = JSON.stringify({ index, previousHash, timestamp, transactions });
  return crypto.createHash("sha256").update(data).digest("hex");
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function loadChain() {
  if (!fs.existsSync(CHAIN_FILE)) return [genesisBlock()];
  try {
    return JSON.parse(fs.readFileSync(CHAIN_FILE, "utf8"));
  } catch {
    return [genesisBlock()];
  }
}

function saveChain(chain) {
  fs.mkdirSync(path.dirname(CHAIN_FILE), { recursive: true });
  fs.writeFileSync(CHAIN_FILE, JSON.stringify(chain, null, 2));
}

function genesisBlock() {
  return createBlock(0, "0", [
    { type: "GENESIS", message: "Gig Reputation Chain" },
  ]);
}

// ─── Chain Validation ─────────────────────────────────────────────────────────

function isChainValid(chain) {
  for (let i = 1; i < chain.length; i++) {
    const current = chain[i];
    const previous = chain[i - 1];
    const expected = computeHash(
      current.index,
      current.previousHash,
      current.timestamp,
      current.transactions,
    );
    if (current.hash !== expected) return false;
    if (current.previousHash !== previous.hash) return false;
  }
  return true;
}

// ─── Add Transaction ──────────────────────────────────────────────────────────
// Each write creates a new block containing one transaction.

function addTransaction(transaction) {
  const chain = loadChain();
  const lastBlock = chain[chain.length - 1];
  const newBlock = createBlock(lastBlock.index + 1, lastBlock.hash, [
    transaction,
  ]);
  chain.push(newBlock);
  saveChain(chain);
  return newBlock;
}

// ─── Queries ──────────────────────────────────────────────────────────────────

// Collect all transactions of a given type across the chain
function getAllTransactions(type) {
  const chain = loadChain();
  const txns = [];
  for (const block of chain) {
    for (const tx of block.transactions) {
      if (tx.type === type) {
        txns.push({
          ...tx,
          blockIndex: block.index,
          blockHash: block.hash,
          timestamp: block.timestamp,
        });
      }
    }
  }
  return txns;
}

// Get the latest state of a profile by publicKey
// (walks the chain and applies REGISTER then any UPDATEs)
function getProfile(publicKey) {
  const chain = loadChain();
  let profile = null;

  for (const block of chain) {
    for (const tx of block.transactions) {
      if (
        (tx.type === "REGISTER_PROFILE" || tx.type === "UPDATE_PROFILE") &&
        tx.publicKey === publicKey
      ) {
        profile = {
          ...tx,
          blockIndex: block.index,
          blockHash: block.hash,
          timestamp: block.timestamp,
        };
      }
    }
  }
  return profile; // null if not found
}

// Get all profiles (latest state of each)
function getAllProfiles() {
  const chain = loadChain();
  const profilesMap = new Map();

  for (const block of chain) {
    for (const tx of block.transactions) {
      if (tx.type === "REGISTER_PROFILE" || tx.type === "UPDATE_PROFILE") {
        profilesMap.set(tx.publicKey, {
          ...tx,
          blockIndex: block.index,
          blockHash: block.hash,
          timestamp: block.timestamp,
        });
      }
    }
  }
  // Return early if no profiles
  if (profilesMap.size === 0) return [];

  // Fetch all reviews to compute reviewCount and averageRating
  const allReviewsMap = new Map();
  for (const block of chain) {
    for (const tx of block.transactions) {
      if (tx.type === "POST_REVIEW") {
        if (!allReviewsMap.has(tx.subjectKey)) {
          allReviewsMap.set(tx.subjectKey, []);
        }
        allReviewsMap.get(tx.subjectKey).push(tx);
      }
    }
  }

  const profiles = [];
  for (const profile of profilesMap.values()) {
    const reviews = allReviewsMap.get(profile.publicKey) || [];
    const avg = reviews.length
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
      : null;

    profiles.push({
      publicKey: profile.publicKey,
      name: profile.name,
      occupation: profile.occupation,
      location: profile.location,
      contactHash: profile.contactHash,
      registeredAt: profile.timestamp,
      blockIndex: profile.blockIndex,
      reviewCount: reviews.length,
      averageRating: avg ? parseFloat(avg) : null,
    });
  }

  return profiles;
}

// Get all reviews for a given publicKey
function getReviews(publicKey) {
  const chain = loadChain();
  const reviews = [];

  for (const block of chain) {
    for (const tx of block.transactions) {
      if (tx.type === "POST_REVIEW" && tx.subjectKey === publicKey) {
        reviews.push({
          reviewerKey: tx.reviewerKey,
          rating: tx.rating,
          comment: tx.comment,
          blockIndex: block.index,
          blockHash: block.hash,
          timestamp: block.timestamp,
        });
      }
    }
  }
  return reviews;
}

// Check if publicKey has already reviewed subjectKey
function hasReviewed(reviewerKey, subjectKey) {
  const chain = loadChain();
  for (const block of chain) {
    for (const tx of block.transactions) {
      if (
        tx.type === "POST_REVIEW" &&
        tx.subjectKey === subjectKey &&
        tx.reviewerKey === reviewerKey
      )
        return true;
    }
  }
  return false;
}

// Total number of registered profiles
function totalProfiles() {
  const registered = new Set();
  const chain = loadChain();
  for (const block of chain) {
    for (const tx of block.transactions) {
      if (tx.type === "REGISTER_PROFILE") registered.add(tx.publicKey);
    }
  }
  return registered.size;
}

// Chain info
function getChainInfo() {
  const chain = loadChain();
  return {
    length: chain.length,
    isValid: isChainValid(chain),
    lastHash: chain[chain.length - 1].hash,
  };
}

module.exports = {
  addTransaction,
  getProfile,
  getAllProfiles,
  getReviews,
  hasReviewed,
  totalProfiles,
  getChainInfo,
  getAllTransactions,
};
