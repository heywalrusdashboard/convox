import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import jwtEncode from "jwt-encode";

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return alert("Email and Password are required");

    setLoading(true);
    try {
      const tokenData ={
      email:email,
      passowrd:password,
    }
      const token = jwtEncode(tokenData, "walrus", { alg: "HS256" });
      const res = await fetch("https://walrus.kalavishva.com/webhook/loginv2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok && data.length > 0) {
        localStorage.setItem("token", data[0].jwt_token);
        localStorage.setItem("userDetails", JSON.stringify(data[0]));

        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white p-6 rounded-2xl shadow-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold text-gray-800">
            Walrus ConvoX
          </h1>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-medium">Login to your Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your registered Email Address
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Input
            type="email"
            placeholder="user@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleLogin} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </div>

        <div className="text-center mt-6 text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
