import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

const DashboardPage = () => {
  const [filter, setFilter] = useState("today");

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4 outline-1 py-4  px-7">
        <h1 className="text-lg font-medium">
          Dashboard - Your Companions at Work
        </h1>

        <div className="flex items-center gap-4">
          <Menubar>
            <MenubarMenu>
              <MenubarTrigger>...</MenubarTrigger>
              <MenubarContent>
                <MenubarItem>
                  Configure Companion <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarSeparator />
                <MenubarItem>Upgrade Plan</MenubarItem>
              </MenubarContent>
            </MenubarMenu>
          </Menubar>

          <Button>Reports</Button>

          <Avatar>
            <AvatarImage src="/avatar.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </div>

      <div className="p-6 space-y-6">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Total Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">$45,678.90</p>
              <p className="text-sm text-green-600">+20% month over month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Interactions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">2,405</p>
              <p className="text-sm text-green-600">+33% month over month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Users Identified</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">10,353</p>
              <p className="text-sm text-red-500">-8% month over month</p>
            </CardContent>
          </Card>
        </div>

        {/* Table + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Latest 10 Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-gray-500 border-b">
                    <tr>
                      <th className="py-2">User's Inquiry</th>
                      <th>Date & Time</th>
                      <th>Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { inquiry: "website.net", date: "4321", source: "+84%" },
                      { inquiry: "website.net", date: "4033", source: "-8%" },
                      { inquiry: "website.net", date: "3128", source: "+2%" },
                      { inquiry: "website.net", date: "2104", source: "+33%" },
                      { inquiry: "website.net", date: "2003", source: "+30%" },
                      { inquiry: "website.net", date: "1894", source: "+15%" },
                      { inquiry: "website.net", date: "405", source: "-12%" },
                    ].map((row, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2">{row.inquiry}</td>
                        <td>{row.date}</td>
                        <td>{row.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Conversations Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
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
