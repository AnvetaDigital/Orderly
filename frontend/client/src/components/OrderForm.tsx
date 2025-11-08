import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";
import { createOrder } from "../api/orderApi";

interface Product {
  id: number;
  name: string;
  stock: number;
  price: number;
}

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  maxStock: number;
}

const OrderForm = () => {
  const { data: products } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });
  const queryClient = useQueryClient();

  const [customerName, setCustomerName] = useState("");
  const [availableProducts, setAvailableProducts] = useState<Product[]>([]);
  const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
  const [message, setMessage] = useState<{
    type: "success" | "error" | "";
    text: string;
  }>({
    type: "",
    text: "",
  });

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      setCustomerName("");
      setSelectedItems([]);
      setAvailableProducts(products || []);
      setMessage({ type: "success", text: "Order placed successfully!" });
      setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    },
    onError: () => {
      setMessage({ type: "error", text: "Failed to create order." });
    },
  });

  useEffect(() => {
    if (products) setAvailableProducts(products);
  }, [products]);

  const handleAddItem = (product: Product) => {
    if (product.stock <= 0) return;

    const updatedAvailable = availableProducts
      .map((p) => (p.id === product.id ? { ...p, stock: p.stock - 1 } : p))
      .filter((p) => p.stock > 0);
    setAvailableProducts(updatedAvailable);

    const existing = selectedItems.find(
      (item) => item.product_id === product.id
    );
    if (existing) {
      if (existing.quantity >= existing.maxStock) return;
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.product_id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          product_id: product.id,
          name: product.name,
          quantity: 1,
          maxStock: product.stock,
        },
      ]);
    }
  };

  const handleQuantityChange = (id: number, change: number) => {
    const selectedProduct = selectedItems.find(
      (item) => item.product_id === id
    );
    if (!selectedProduct) return;

    const newQty = selectedProduct.quantity + change;
    if (newQty < 0) return;

    if (newQty === 0) {
      setSelectedItems((prev) => prev.filter((item) => item.product_id !== id));

      const baseProduct = products?.find((p: { id: number }) => p.id === id);
      if (baseProduct) {
        setAvailableProducts((prev) => {
          const existing = prev.find((p) => p.id === id);
          return existing
            ? prev.map((p) => (p.id === id ? { ...p, stock: p.stock + 1 } : p))
            : [...prev, { ...baseProduct, stock: 1 }];
        });
      }
    } else {
      setSelectedItems((prev) =>
        prev.map((item) =>
          item.product_id === id ? { ...item, quantity: newQty } : item
        )
      );

      setAvailableProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, stock: p.stock - change } : p))
      );
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      setMessage({ type: "error", text: "Customer name is required." });
      return;
    }

    if (selectedItems.length === 0) {
      setMessage({ type: "error", text: "Please add at least one product." });
      return;
    }

    mutation.mutate({
      customer_name: customerName.trim(),
      items: selectedItems.map(({ product_id, quantity }) => ({
        product_id,
        quantity,
      })),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h3>Create Order</h3>

      {message.text && (
        <p className={message.type === "success" ? "msg-success" : "msg-error"}>
          {message.text}
        </p>
      )}

      <input
        placeholder="Customer Name"
        value={customerName}
        onChange={(e) => {
          setCustomerName(e.target.value);
          if (message.type === "error") setMessage({ type: "", text: "" });
        }}
      />

      <h4>Available Products</h4>
      {availableProducts.length === 0 ? (
        <p>All products out of stock</p>
      ) : (
        <ul>
          {availableProducts.map((p) => (
            <li key={p.id}>
              {p.name} (Stock: {p.stock}){" "}
              <button type="button" onClick={() => handleAddItem(p)}>
                Add
              </button>
            </li>
          ))}
        </ul>
      )}

      {selectedItems.length > 0 && (
        <>
          <h4>Selected Products</h4>
          <ul>
            {selectedItems.map((item) => {
              const isMax = item.quantity >= item.maxStock;
              return (
                <li key={item.product_id}>
                  {item.name} — Quantity: {item.quantity}{" "}
                  <button
                    type="button"
                    onClick={() =>
                      !isMax && handleQuantityChange(item.product_id, 1)
                    }
                    disabled={isMax}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuantityChange(item.product_id, -1)}
                  >
                    -
                  </button>
                  {isMax && (
                    <span style={{ marginLeft: "10px", color: "red" }}>
                      Stock limit reached
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}

      <button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? "Placing..." : "Place Order"}
      </button>
    </form>
  );
};

export default OrderForm;
