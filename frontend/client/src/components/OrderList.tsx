import { useQuery } from "@tanstack/react-query";
import { getOrders } from "../api/orderApi";

interface ApiOrderItem {
  product_name: string;
  quantity: number;
}
interface ApiOrder {
  order_id: number;
  customer_name: string;
  created_at: string;
  items: ApiOrderItem[];
}

const OrderList = () => {
  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery<ApiOrder[]>({
    queryKey: ["orders"],
    queryFn: getOrders,
  });

  if (isLoading) return <p>Loading orders...</p>;
  if (isError) return <p>Error loading orders.</p>;
  if (!orders || orders.length === 0) return <p>No orders yet.</p>;

  return (
    <div className="card">
      <h3 className="title">Orders</h3>
      {orders.map((o) => (
        <div key={o.order_id} className="order-card">
          <div className="order-header">
            {o.customer_name} — {new Date(o.created_at).toLocaleString()}
          </div>
          <ul className="list">
            {o.items.map((it, idx) => (
              <li key={idx} className="list-item">
                {it.product_name} — Qty: {it.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default OrderList;
