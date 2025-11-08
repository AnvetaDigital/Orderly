import axios from "axios";

const PRODUCT_API = "http://localhost:5000/api/products";

export const getProducts = async () => {
    const res = await axios.get(PRODUCT_API);
    return res.data;
}

export const addProduct = async (product: {
    name: string;
    price: number;
    stock: number;
}) => {
    const res = await axios.post(PRODUCT_API, product);
    return res.data;
}