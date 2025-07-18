import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../ui/loader";

const ProtectedRoute = ({ children }) => {
  const [authValid, setAuthValid] = useState(null);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      if (!token) return setAuthValid(false);

      try {
        const res = await fetch("https://walrus.kalavishva.com/webhook/user_account", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res.ok) {
          setAuthValid(true);
        } else {
          setAuthValid(false);
        }
      } catch (error) {
        console.error("Token validation failed:", error);
        setAuthValid(false);
      }
    };

    validateToken();
  }, []);

  if (authValid === null) return <div className=" h-screen w-screen flex justify-center items-center"><Loader/></div>;
  if (authValid === false) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
