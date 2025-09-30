import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/data-table";
import Loader from "@/components/ui/loader";

function ChatsReport() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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
        const messages = [...item.user_messages].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        // Group by session_id
        const map = new Map();
        for (const m of messages) {
          const current = map.get(m.session_id) || [];
          current.push(m);
          map.set(m.session_id, current);
        }
        const grouped = Array.from(map.entries()).map(([session_id, msgs]) => {
          const first = msgs[msgs.length - 1];
          const last = msgs[0];
          return {
            session_id,
            count: msgs.length,
            firstTimestamp: first?.timestamp,
            lastTimestamp: last?.timestamp,
            preview: msgs[0]?.user_msg || "",
          };
        });
        setRows(grouped);
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
    return rows.filter((r) => {
      const matchesText = !q
        ? true
        : [r.session_id, r.preview].some((v) =>
            String(v || "")
              .toLowerCase()
              .includes(q)
          );
      const first = new Date(r.firstTimestamp);
      const last = new Date(r.lastTimestamp);
      const afterStart = startDate
        ? last >= new Date(startDate + "T00:00:00")
        : true;
      const beforeEnd = endDate
        ? first <= new Date(endDate + "T23:59:59")
        : true;
      return matchesText && afterStart && beforeEnd;
    });
  }, [rows, search, startDate, endDate]);

  const columns = useMemo(() => {
    return [
      { accessorKey: "session_id", header: () => "Session ID" },
      { accessorKey: "count", header: () => "Messages" },
      { accessorKey: "firstTimestamp", header: () => "Started" },
      { accessorKey: "lastTimestamp", header: () => "Last Activity" },
      {
        accessorKey: "preview",
        header: () => "Last Message",
        cell: ({ row }) => (
          <span className="block max-w-xl whitespace-normal break-words leading-7">
            {row.original.preview}
          </span>
        ),
      },
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
        <CardTitle>Chats ({filtered.length})</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search session..."
            className="w-56"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <input
            type="date"
            className="border rounded-md px-2 py-1 text-sm bg-transparent"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className="border rounded-md px-2 py-1 text-sm bg-transparent"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}

export default ChatsReport;
