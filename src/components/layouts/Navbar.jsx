import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const Navbar = ({ title = "Dashboard - Your Companions at Work" }) => {
  const navigate = useNavigate();
  const [credits, setCredits] = useState(null);
  const [userInfo, setUserInfo] = useState({ name: "", id: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userDetails = JSON.parse(localStorage.getItem("userDetails")) || {};

    if (userDetails?.name || userDetails?.User_id) {
      setUserInfo({
        name: userDetails.name || "User",
        id: userDetails.User_id || "N/A",
      });
    }

    if (!token) return;

    const fetchCredits = async () => {
      try {
        const res = await fetch("https://walrus.kalavishva.com/webhook/user_account", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCredits(data[0]?.credits_balance ?? 0);
      } catch (err) {
        console.error("Failed to fetch credits", err);
        setCredits(null);
      }
    };

    fetchCredits();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // 🔹 Extract initials (e.g., "John Doe" → "JD")
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    return words.length === 1
      ? words[0][0].toUpperCase()
      : (words[0][0] + words[1][0]).toUpperCase();
  };

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 py-4 px-7 border-b bg-white">
      <h1 className="text-lg font-medium">{title}</h1>

      <div className="flex items-center gap-4">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>...</MenubarTrigger>
            <MenubarContent>
              <MenubarItem onClick={() => navigate("/configureCompanion")}>
                Configure Companion <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onClick={() => navigate("/")}>
                Dashboard <MenubarShortcut>⌘D</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Upgrade Plan</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>

        <Button onClick={() => navigate("/reports")}>Reports</Button>

        {/* Avatar with Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/avatar.jpg" />
              <AvatarFallback>{getInitials(userInfo.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-52 text-sm">
            <DropdownMenuItem disabled>
              <div className="flex flex-col text-xs leading-snug">
                <span className="font-medium">{userInfo.name}</span>
                <span className="text-gray-500">ID: {userInfo.id}</span>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              Credits: {credits !== null ? credits : "Loading..."}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
