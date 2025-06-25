import { useEffect, useState } from "react";
import axios from "axios";

export const useDashboardData = () => {
  const [data, setData] = useState({
    totalConversations: 0,
    totalInteractions: 0,
    totalUsers: 0,
    userMessages: [],
    chartData: [],
  });
  const [loading, setLoading] = useState(true);

  // Helper to format chart data from messages
  const dataForChart = (messages = []) => {
    const countByDate = {};

    messages.forEach((msg) => {
      const date = msg.timestamp.split(" ")[0]; // "2025-05-26"
      countByDate[date] = (countByDate[date] || 0) + 1;
    });

    return Object.entries(countByDate)
      .map(([date, value]) => ({ name: date, value }))
      .sort((a, b) => new Date(a.name) - new Date(b.name));
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        console.log("Token from localStorage:", token);
        if (!token) {
          console.error("No token found in localStorage");
          return;
        }
        const data = localStorage.getItem("userDetails");
        if (!data) {
          console.error("No user details found in localStorage");
          return;
        }
        const { User_id } = JSON.parse(data);
        const res = await fetch(
          "https://walrus.kalavishva.com/webhook/dashboardv1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: User_id }),
          }
        );

        const resData = await res.json();
        const item = resData[0];

        const last10 = [...item.user_messages]
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) // sort descending
          .slice(0, 10);
          
        console.log(last10);// latest 10 only

        setData({
          totalConversations: item.totalConversations,
          totalInteractions: item.totalInteractions,
          totalUsers: item.totalUsers,
          userMessages: last10,
          chartData: dataForChart(last10),
        });
      } catch (err) {
        console.error("Error fetching dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return { data, loading };
};
