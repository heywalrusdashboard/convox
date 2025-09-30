import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DataTable from "@/components/ui/data-table";
import Loader from "@/components/ui/loader";

function UsageReport() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const data = localStorage.getItem("userDetails");
        if (!token || !data) return;
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
        const json = await res.json();
        const item = json[0];
        // Simple usage summary
        setRows([
          { key: "Total Conversations", value: item.totalConversations },
          { key: "Total Interactions", value: item.totalInteractions },
          { key: "Users Identified", value: item.totalUsers },
        ]);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const columns = useMemo(() => {
    return [
      { accessorKey: "key", header: () => "Metric" },
      { accessorKey: "value", header: () => "Value" },
    ];
  }, []);

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage and Billing</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={rows} />
      </CardContent>
    </Card>
  );
}

export default UsageReport;
