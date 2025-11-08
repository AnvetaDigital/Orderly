import { NavLink, Route, Routes } from "react-router-dom";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import OrderForm from "./components/OrderForm";
import OrderList from "./components/OrderList";

function App() {
  return (
    <div className="app-container">
      <h1 className="app-title">Orderly App</h1>

      <nav className="navbar">
        <NavLink
          to="/add-product"
          className={({ isActive }) =>
            isActive ? "navlink active" : "navlink"
          }
        >
          Add Product
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive ? "navlink active" : "navlink"
          }
        >
          Product List
        </NavLink>

        <NavLink
          to="/create-order"
          className={({ isActive }) =>
            isActive ? "navlink active" : "navlink"
          }
        >
          Create Order
        </NavLink>

        <NavLink
          to="/orders"
          className={({ isActive }) =>
            isActive ? "navlink active" : "navlink"
          }
        >
          Order List
        </NavLink>
      </nav>

      <div className="page-container">
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/add-product" element={<AddProduct />} />
          <Route path="/products" element={<ProductList />} />
          <Route path="/create-order" element={<OrderForm />} />
          <Route path="/orders" element={<OrderList />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
