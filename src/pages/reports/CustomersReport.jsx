import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/data-table";
import Loader from "@/components/ui/loader";

function CustomersReport() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");

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
        // Derive customers by grouping messages with user_email or user_id
        const map = new Map();
        for (const m of item.user_messages) {
          const key = m.customer_email || m.user_id || "unknown";
          const current = map.get(key) || {
            email: m.customer_email || "-",
            user_id: m.user_id || "-",
            sessions: new Set(),
            messages: 0,
            lastSeen: null,
          };
          current.messages += 1;
          if (m.session_id) current.sessions.add(m.session_id);
          const ts = new Date(m.timestamp);
          if (!current.lastSeen || ts > new Date(current.lastSeen))
            current.lastSeen = m.timestamp;
          map.set(key, current);
        }
        const rows = Array.from(map.values()).map((c) => ({
          email: c.email,
          user_id: c.user_id,
          sessions: c.sessions.size,
          messages: c.messages,
          lastSeen: c.lastSeen,
        }));
        setRows(rows);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) =>
      [r.email, r.user_id]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const columns = useMemo(() => {
    return [
      { accessorKey: "email", header: () => "Customer Email" },
      { accessorKey: "user_id", header: () => "User ID" },
      { accessorKey: "sessions", header: () => "Sessions" },
      { accessorKey: "messages", header: () => "Messages" },
      { accessorKey: "lastSeen", header: () => "Last Seen" },
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Customers ({filtered.length})</CardTitle>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search email or user id"
            className="w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}

export default CustomersReport;
