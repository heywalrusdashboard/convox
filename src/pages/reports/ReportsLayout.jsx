import { NavLink, Outlet } from "react-router-dom";
import Navbar from "@/components/layouts/Navbar";

function ReportsLayout() {
  const navItems = [
    { to: "/reports/conversations", label: "Conversations" },
    { to: "/reports/chats", label: "Chats" },
    { to: "/reports/customers", label: "Customers" },
    { to: "/reports/invoices", label: "Invoices" },
    { to: "/reports/usage", label: "Usage and Billing" },
  ];

  return (
    <div className="flex flex-col h-screen">
      <Navbar title="Reports" />
      <div className="flex h-full">
        <aside className="w-64 border-r p-4 space-y-2">
          <h2 className="text-sm font-semibold text-gray-500 mb-2">
            Report Type
          </h2>
          <nav className="flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm ${
                    isActive
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
                end
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ReportsLayout;
