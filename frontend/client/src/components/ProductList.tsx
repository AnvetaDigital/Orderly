import { useQuery } from "@tanstack/react-query";
import { getProducts } from "../api/productApi";

const ProductList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) return <p>Loading products...</p>;
  if (isError) return <p>Error loading products.</p>;

  return (
    <div className="card">
      <h3 className="title">Product List</h3>
      <ul className="list">
        {data.map((p: any) => (
          <li key={p.id} className="list-item">
            {p.name} — ₹{p.price} (Stock: {p.stock})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductList;
