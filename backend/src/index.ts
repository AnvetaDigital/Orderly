import express from "express";
import cors from "cors";
import "./db"; 
import { productRouter } from "./routes/productRoutes";
import { orderRouter } from "./routes/orderRoutes";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("node.js+typescript server is running fine");
});

app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`); 
})