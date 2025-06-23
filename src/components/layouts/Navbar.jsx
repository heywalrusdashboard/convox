import { useNavigate } from "react-router-dom";
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
} from "@/components/ui/dropdown-menu"; // 🔹 Import dropdown

const Navbar = ({ title = "Dashboard - Your Companions at Work" }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear(); // or just remove token/userDetails
    navigate("/login");
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
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem disabled>
              Credits: 500
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Navbar;
