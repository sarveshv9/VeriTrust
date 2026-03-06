const crypto = require("crypto");
const blockchain = require("../blockchain");

const serviceController = {
    // POST /service  (auth required)
    // Body: { title, description, category, price }
    onCreate: async (req, res) => {
        try {
            const { publicKey } = req.user;
            const { title, description, category, price } = req.body;

            if (!title || !category || price === undefined) {
                return res.status(400).json({
                    success: false,
                    message: "title, category, and price are required",
                });
            }

            const priceNum = parseFloat(price);
            if (isNaN(priceNum) || priceNum < 0) {
                return res.status(400).json({ success: false, message: "price must be a positive number" });
            }

            // Ensure the freelancer has a profile
            const profile = blockchain.getProfile(publicKey);
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "You must create a profile before adding services",
                });
            }

            const serviceId = crypto.randomUUID();

            const block = blockchain.addTransaction({
                type: "ADD_SERVICE",
                serviceId,
                publicKey,
                title,
                description: description || "",
                category,
                price: priceNum,
            });

            res.status(201).json({
                success: true,
                message: "Service added to the blockchain",
                serviceId,
                blockIndex: block.index,
                blockHash: block.hash,
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // GET /services/:publicKey  (public)
    onGetForFreelancer: async (req, res) => {
        try {
            const { publicKey } = req.params;
            const services = blockchain.getServices(publicKey);
            res.status(200).json({ success: true, data: services });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },

    // GET /services  (public, optional ?search=&category=)
    onGetAll: async (req, res) => {
        try {
            const { search, category } = req.query;
            let services = blockchain.getAllServices();

            if (search) {
                const lower = search.toLowerCase();
                services = services.filter(
                    (s) =>
                        (s.title && s.title.toLowerCase().includes(lower)) ||
                        (s.description && s.description.toLowerCase().includes(lower)) ||
                        (s.sellerName && s.sellerName.toLowerCase().includes(lower)) ||
                        (s.category && s.category.toLowerCase().includes(lower))
                );
            }

            if (category) {
                const lower = category.toLowerCase();
                services = services.filter(
                    (s) => s.category && s.category.toLowerCase() === lower
                );
            }

            res.status(200).json({ success: true, data: services });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    },
};

module.exports = serviceController;
