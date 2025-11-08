import express from "express";
import { pool } from "../db";

export const orderRouter = express.Router();

// Create new order
orderRouter.post("/", async (req, res) => {
  const client = await pool.connect();
  try {
    const { customer_name, items } = req.body; 
    if (!customer_name || !items || items.length === 0) {
      return res.status(400).json({ error: "Missing order details" });
    }

    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO orders (customer_name) VALUES ($1) RETURNING id",
      [customer_name]
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      const productCheck = await client.query(
        "SELECT stock FROM products WHERE id = $1",
        [item.product_id]
      );
      const product = productCheck.rows[0];

      if (!product || product.stock < item.quantity) {
        throw new Error(`Not enough stock for product ID ${item.product_id}`);
      }

      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity) VALUES ($1, $2, $3)",
        [orderId, item.product_id, item.quantity]
      );

      await client.query(
        "UPDATE products SET stock = stock - $1 WHERE id = $2",
        [item.quantity, item.product_id]
      );
    }

    await client.query("COMMIT");
    res
      .status(201)
      .json({ message: "Order created successfully", order_id: orderId });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Internal server error" });
  } finally {
    client.release();
  }
});

// Get orders with product names
orderRouter.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
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
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
