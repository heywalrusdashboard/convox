import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/layouts/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState } from "react";
import Loader from "@/components/ui/loader";

import { useDashboardData } from "@/hooks/useDashboardData";
import { useTheme } from "@/components/ui/ThemeContext";

const DashboardPage = () => {
  const [filter, setFilter] = useState("today");
  const { data, loading } = useDashboardData();
  const { theme } = useTheme();

  const { totalConversations, totalInteractions, totalUsers, userMessages, chartData } = data;

  // Helper to filter messages by date
  const filterMessages = (messages) => {
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10);
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay() + 1); // Monday as start of week
    weekStart.setHours(0,0,0,0);

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

  const filteredMessages = filterMessages(userMessages);

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
    weekStart.setHours(0,0,0,0);
    if (filter === "today") {
      return d.name === todayStr;
    } else if (filter === "yesterday") {
      return d.name === yesterdayStr;
    } else if (filter === "this_week") {
      return dDate >= weekStart && dDate <= now;
    }
    return true;
  });

  if (loading) return <div className=" h-screen w-screen flex justify-center items-center"><Loader/></div>;

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
          >
            <ToggleGroupItem value="today">Today</ToggleGroupItem>
            <ToggleGroupItem value="yesterday">Yesterday</ToggleGroupItem>
            <ToggleGroupItem value="this_week">This Week</ToggleGroupItem>
          </ToggleGroup>

          <Input type="search" placeholder="Search..." className="w-48" />
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader><CardTitle>Total Conversations</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalConversations}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Total Interactions</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalInteractions}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Users Identified</CardTitle></CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{totalUsers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Table & Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <Card>
            <CardHeader><CardTitle>Latest 10 Conversations</CardTitle></CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="py-2">User's Inquiry</th>
                      <th>Date & Time</th>
                      <th>Session ID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMessages.map((msg, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{msg.user_msg}</td>
                        <td>{msg.timestamp}</td>
                        <td>{msg.session_id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader><CardTitle>Conversations Trend</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={filteredChartData}>
                  <XAxis dataKey="name" stroke="var(--color-foreground)" />
                  <YAxis stroke="var(--color-foreground)" />
                  <Tooltip
                    contentStyle={{ background: 'var(--color-popover)', color: 'var(--color-popover-foreground)', border: '1px solid var(--color-border)' }}
                    cursor={{ fill: 'var(--color-muted)' }}
                  />
                  <Bar dataKey="value" fill={theme === 'dark' ? '#fff' : '#000'} radius={[4, 4, 0, 0]} />
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
