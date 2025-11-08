"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
exports.productRouter = express_1.default.Router();
// ✅ GET all products
exports.productRouter.get("/", async (req, res) => {
    try {
        const result = await db_1.pool.query("SELECT * FROM products ORDER BY id ASC");
        res.json(result.rows);
    }
    catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ✅ POST new product
exports.productRouter.post("/", async (req, res) => {
    try {
        const { name, price, stock } = req.body;
        if (!name || !price || !stock) {
            return res.status(400).json({ error: "Missing fields" });
        }
        const result = await db_1.pool.query("INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *", [name, price, stock]);
        res.status(201).json(result.rows[0]);
    }
    catch (err) {
        console.error("Error adding product:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
//# sourceMappingURL=productRoutes.js.map