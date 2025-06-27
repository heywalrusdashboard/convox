import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import Loader from "@/components/ui/loader";

const data = [
  { name: "Jan", value: 45000 },
  { name: "Feb", value: 55000 },
  { name: "Mar", value: 50000 },
  { name: "Apr", value: 63000 },
  { name: "May", value: 78000 },
  { name: "Jun", value: 70000 },
  { name: "Jul", value: 64000 },
  { name: "Aug", value: 59000 },
  { name: "Sep", value: 54000 },
  { name: "Oct", value: 51000 },
  { name: "Nov", value: 48000 },
  { name: "Dec", value: 32000 },
];

import { useDashboardData } from "@/hooks/useDashboardData";

const DashboardPage = () => {
  const [filter, setFilter] = useState("today");
  const { data, loading } = useDashboardData();

const { totalConversations, totalInteractions, totalUsers, userMessages, chartData } = data;


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
                    {[...userMessages].map((msg, i) => (
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
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#000" radius={[4, 4, 0, 0]} />
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
