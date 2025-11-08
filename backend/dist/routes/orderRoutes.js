"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("../db");
exports.orderRouter = express_1.default.Router();
// Create new order
exports.orderRouter.post("/", async (req, res) => {
    const client = await db_1.pool.connect();
    try {
        const { customer_name, items } = req.body; // items = [{ product_id, quantity }]
        if (!customer_name || !items || items.length === 0) {
            return res.status(400).json({ error: "Missing order details" });
        }
        await client.query("BEGIN");
        // insert order (uses created_at column)
        const orderResult = await client.query("INSERT INTO orders (customer_name) VALUES ($1) RETURNING id", [customer_name]);
        const orderId = orderResult.rows[0].id;
        // for each item: check stock, insert order_items, decrease stock
        for (const item of items) {
            const productCheck = await client.query("SELECT stock FROM products WHERE id = $1", [item.product_id]);
            const product = productCheck.rows[0];
            if (!product || product.stock < item.quantity) {
                throw new Error(`Not enough stock for product ID ${item.product_id}`);
            }
            await client.query("INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)", [orderId, item.product_id, item.quantity]);
            await client.query("UPDATE products SET stock = stock - $1 WHERE id = $2", [item.quantity, item.product_id]);
        }
        await client.query("COMMIT");
        res
            .status(201)
            .json({ message: "Order created successfully", order_id: orderId });
    }
    catch (err) {
        await client.query("ROLLBACK");
        console.error("Error creating order:", err);
        res.status(500).json({ error: "Internal server error" });
    }
    finally {
        client.release();
    }
});
// Get orders with product names
exports.orderRouter.get("/", async (req, res) => {
    try {
        const result = await db_1.pool.query(`
      SELECT 
        o.id AS order_id,
        o.customer_name,
        o.created_at,
        json_agg(
          json_build_object(
            'product_name', p.name,
            'quantity', oi.quantity
          )
          ORDER BY oi.id
        ) AS items
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      GROUP BY o.id
      ORDER BY o.created_at DESC;
    `);
        res.json(result.rows);
    }
    catch (err) {
        console.error("Error fetching orders:", err);
        res.status(500).json({ error: "Internal server error" });
    }
});
//# sourceMappingURL=orderRoutes.js.map