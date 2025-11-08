import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProduct } from "../api/productApi";

const AddProduct = () => {
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({
    type: "",
    text: "",
  });
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setForm({ name: "", price: "", stock: "" });
      setMessage({ type: "success", text: "Product added successfully!" });
    },
    onError: () => {
      setMessage({
        type: "error",
        text: "Failed to add product. Please try again.",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (message.type === "error") setMessage({ type: "", text: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.price || !form.stock) {
      setMessage({ type: "error", text: "All fields are required." });
      return;
    }

    mutation.mutate({
      name: form.name.trim(),
      price: Number(form.price),
      stock: Number(form.stock),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Add Product</h3>
      <input
        name="name"
        placeholder="Product Name"
        value={form.name}
        onChange={handleChange}
      />
      <input
        name="price"
        type="number"
        placeholder="Price"
        value={form.price}
        onChange={handleChange}
      />
      <input
        name="stock"
        type="number"
        placeholder="Stock"
        value={form.stock}
        onChange={handleChange}
      />
      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Adding..." : "Add Product"}
      </button>

      {message.text && (
        <p className={message.type === "success" ? "msg-success" : "msg-error"}>
          {message.text}
        </p>
      )}
    </form>
  );
};

export default AddProduct;
