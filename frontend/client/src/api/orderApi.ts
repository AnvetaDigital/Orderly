import axios from "axios";

const ORDER_API = "http://localhost:5000/api/orders";

export const getOrders = async () => {
    const res = await axios.get(ORDER_API);
    return res.data;
}

export const createOrder = async (order: {
    customer_name: string;
    items: { product_id: number; quantity: number }[];
}) => {
    const res = await axios.post(ORDER_API, order);
    return res.data;
}