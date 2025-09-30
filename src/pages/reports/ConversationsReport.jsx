import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";
import { Download } from "lucide-react";
import DataTable from "@/components/ui/data-table";

function ConversationsReport() {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sort, setSort] = useState({ key: "timestamp", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
        const allMessagesSorted = [...item.user_messages].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setRows(allMessagesSorted);
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
      // Text search across fields
      const matchesText = !q
        ? true
        : [r.session_id, r.user_msg, r.user_id]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));

      // Date range filter (inclusive)
      const ts = new Date(r.timestamp);
      const afterStart = startDate
        ? ts >= new Date(startDate + "T00:00:00")
        : true;
      const beforeEnd = endDate ? ts <= new Date(endDate + "T23:59:59") : true;

      return matchesText && afterStart && beforeEnd;
    });
  }, [rows, search, startDate, endDate]);

  // No tag/sentiment filters in this view

  // shadcn DataTable columns
  const columns = useMemo(() => {
    return [
      {
        accessorKey: "user_msg",
        header: () => "Conversation Summary",
        cell: ({ row }) => (
          <div className="py-4">
            <span className="block max-w-3xl whitespace-normal break-words leading-7">
              {row.original.user_msg}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "timestamp",
        header: () => "Date",
        sortingFn: (a, b) =>
          new Date(a.original.timestamp) - new Date(b.original.timestamp),
        cell: ({ row }) => row.original.timestamp,
      },
      {
        accessorKey: "session_id",
        header: () => "Session ID",
        cell: ({ row }) => row.original.session_id,
      },
    ];
  }, []);

  const downloadCsv = () => {
    const headers = ["user_id", "conversation_summary", "date", "session_id"];
    const csvRows = [headers.join(",")];
    filtered.forEach((r) => {
      const values = [
        r.user_id || "",
        (r.user_msg || "").replaceAll('"', '""'),
        r.timestamp || "",
        r.session_id || "",
      ];
      // Quote fields, escape quotes
      const quoted = values.map((v) => `"${String(v)}"`);
      csvRows.push(quoted.join(","));
    });
    const blob = new Blob([csvRows.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "conversations.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Total Conversations ({filtered.length})</CardTitle>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            placeholder="Search user..."
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
          <Button
            variant="outline"
            onClick={() => {
              setSearch("");
              setStartDate("");
              setEndDate("");
            }}
          >
            Clear
          </Button>
          <Button onClick={downloadCsv}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={filtered} />
      </CardContent>
    </Card>
  );
}

export default ConversationsReport;
