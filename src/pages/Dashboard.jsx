import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import DataTable from "@/components/ui/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Navbar from "@/components/layouts/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useState } from "react";
import Loader from "@/components/ui/loader";

import { useDashboardData } from "@/hooks/useDashboardData";
import { useTheme } from "@/components/ui/ThemeContext";

const DashboardPage = () => {
  const [filter, setFilter] = useState("this_week");
  const { data, loading } = useDashboardData();
  const { theme } = useTheme();

  const {
    totalConversations,
    totalInteractions,
    totalUsers,
    userMessages,
    chartData,
  } = data;

  // Helper to filter messages by date
  const filterMessages = (messages) => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday as start of week
    weekStart.setHours(0, 0, 0, 0);

    return messages.filter((msg) => {
      const msgDate = new Date(msg.timestamp);
      const msgDateStr = msgDate.toISOString().slice(0, 10);
      if (filter === "today") {
        return msgDateStr === todayStr;
      } else if (filter === "yesterday") {
        return msgDateStr === yesterdayStr;
      } else if (filter === "this_week") {
        return msgDate >= weekStart && msgDate <= now;
      }
      return true;
    });
  };

  // Latest 10 conversations should always show (unfiltered)
  const filteredMessages = userMessages;

  // Filter chart data as well
  const filteredChartData = chartData.filter((d) => {
    const dDate = new Date(d.name);
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1);
    weekStart.setHours(0, 0, 0, 0);
    if (filter === "today") {
      return d.name === todayStr;
    } else if (filter === "yesterday") {
      return d.name === yesterdayStr;
    } else if (filter === "this_week") {
      return dDate >= weekStart && dDate <= now;
    } else if (filter === "all") {
      return true;
    }
    return true;
  });
  const chartToShow = filteredChartData.length ? filteredChartData : chartData;

  if (loading)
    return (
      <div className=" h-screen w-screen flex justify-center items-center">
        <Loader />
      </div>
    );

  return (
    <div className="">
      <Navbar />
      <div className="p-6 space-y-6">
        {/* Filter Toggle + Search */}
        <div className="flex items-center justify-between">
          <ToggleGroup
            type="single"
            value={filter}
            onValueChange={(val) => val && setFilter(val)}
            className="rounded-lg border p-1 bg-muted/40 gap-1"
          >
            <ToggleGroupItem
              value="today"
              className="px-3 py-1.5 rounded-md data-[state=on]:bg-background data-[state=on]:shadow"
            >
              Today
            </ToggleGroupItem>
            <ToggleGroupItem
              value="yesterday"
              className="px-3 py-1.5 rounded-md data-[state=on]:bg-background data-[state=on]:shadow"
            >
              Yesterday
            </ToggleGroupItem>
            <ToggleGroupItem
              value="this_week"
              className="px-3 py-1.5 rounded-md data-[state=on]:bg-background data-[state=on]:shadow"
            >
              This Week
            </ToggleGroupItem>
            <ToggleGroupItem
              value="all"
              className="px-3 py-1.5 rounded-md data-[state=on]:bg-background data-[state=on]:shadow"
            >
              All Time
            </ToggleGroupItem>
          </ToggleGroup>

          <Input type="search" placeholder="Search..." className="w-48" />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalConversations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalInteractions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Users Identified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Latest 10 Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-[360px] overflow-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User's Inquiry</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Session ID</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredMessages.map((msg, i) => (
                      <TableRow key={i}>
                        <TableCell className="whitespace-normal break-words">
                          {msg.user_msg}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {msg.timestamp}
                        </TableCell>
                        <TableCell className="font-mono text-xs">
                          {msg.session_id}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Conversations Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={chartToShow}>
                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor={theme === "dark" ? "#8884d8" : "#111827"}
                        stopOpacity={0.9}
                      />
                      <stop
                        offset="100%"
                        stopColor={theme === "dark" ? "#8884d8" : "#111827"}
                        stopOpacity={0.3}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--color-border)"
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    stroke="var(--color-foreground)"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-popover)",
                      color: "var(--color-popover-foreground)",
                      border: "1px solid var(--color-border)",
                    }}
                    cursor={{ fill: "var(--color-muted)" }}
                  />
                  <Bar
                    dataKey="value"
                    fill="url(#barFill)"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
