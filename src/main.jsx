// main.jsx
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "sonner";
import { ProductFruits } from "react-product-fruits";

const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};
const userInfo = {
  username: userDetails?.User_id || "guest", 
  email: userDetails?.User_id || "",
  firstname: userDetails?.company_name || "",
  lastname: userDetails?.last_name || "",
  signUpAt: userDetails?.signup_at || "",
  role: userDetails?.role || "user",
  props: { customProp1: userDetails?.company_name || "N/A" },
};
console.log("Rendering App with userInfo:", userInfo);

createRoot(document.getElementById("root")).render(
  <>
    <Toaster />
    <ProductFruits
      workspaceCode="yzIfXrJokARqNjWZ"
      language="en"
      user={userInfo}
    />
    <App />
  </>
);
