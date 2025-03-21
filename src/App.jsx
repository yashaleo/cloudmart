import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import CloudMartMainPage from "./components/MainPage";
import CustomerSupportPage from "./components/SupportPage";
import AboutPage from "./components/AboutPage";
import CartPage from "./components/CartPage";
import AdminPage from "./components/AdminPage";
import UserProfilePage from "./components/UserProfilePage";
import OrdersPage from "./components/OrdersPage";
import UserOrdersPage from "./components/UserOrdersPage";
import AdminTicketView from "./components/AdminTicketView";
import { initializeUser } from "./utils/userUtils";

function App() {
  useEffect(() => {
    try {
      if (import.meta.env.MODE !== "production") {
        console.log("initializeUser (type):", typeof initializeUser);
        console.log("initializeUser (value):", initializeUser);
      }

      if (typeof initializeUser === "function") {
        initializeUser();
      } else {
        console.error(
          "initializeUser is not a function. Check your import/export.",
        );
      }
    } catch (error) {
      console.error("Error initializing user:", error);
    }
  }, []);

  return (
    <Routes>
      <Route path="/" element={<CloudMartMainPage />} />
      <Route path="/customer-support" element={<CustomerSupportPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/my-orders" element={<UserOrdersPage />} />
      <Route path="/tickets" element={<AdminTicketView />} />
    </Routes>
  );
}

export default App;
