
import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  Barcode, 
  ChartBar, 
  Receipt, 
  Users, 
  Wallet, 
  FolderOpen, 
  Settings, 
  LogOut,
  FileText
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  const navItems = [
    { name: "Dashboard", icon: <ChartBar className="h-5 w-5" />, path: "/" },
    { name: "Inventory", icon: <Barcode className="h-5 w-5" />, path: "/inventory" },
    { name: "Sales", icon: <Receipt className="h-5 w-5" />, path: "/sales" },
    { name: "Shopkeepers", icon: <Users className="h-5 w-5" />, path: "/shopkeepers" },
    { name: "Expenses", icon: <FileText className="h-5 w-5" />, path: "/expenses" },
    { name: "Reports", icon: <FolderOpen className="h-5 w-5" />, path: "/reports" },
    { name: "Financial", icon: <Wallet className="h-5 w-5" />, path: "/financial" },
    { name: "Settings", icon: <Settings className="h-5 w-5" />, path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-14 h-full bg-background shadow-lg transition-all duration-300 z-10 ${
        isOpen ? "w-64" : "w-0"
      }`}
    >
      <div className="h-full overflow-y-auto flex flex-col">
        <nav className="mt-4 px-2 flex-1">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 text-gray-700 rounded-md transition-all ${
                      isActive
                        ? "bg-brand-200 text-brand-800 font-semibold"
                        : "hover:bg-muted"
                    }`
                  }
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-3 text-gray-700 rounded-md hover:bg-muted transition-all"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
          
          <div className="mt-4 text-center text-xs text-muted-foreground">
            <p>Logged in as</p>
            <p className="font-medium">{localStorage.getItem("username") || "User"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
