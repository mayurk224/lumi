import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, Home, LogOut } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, selectUser } from "../../redux/authSlice";
import {
  FiGrid,
  FiFilm,
  FiPlusCircle,
  FiUsers,
  FiHome,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

const NAV_ITEMS = [
  { to: "/admin", label: "Dashboard", icon: FiGrid, exact: true },
  { to: "/admin/movies", label: "Movies", icon: FiFilm, exact: false },
  { to: "/admin/add", label: "Add Movie", icon: FiPlusCircle, exact: false },
  { to: "/admin/users", label: "Users", icon: FiUsers, exact: false },
];

const AdminSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectUser);

  return (
    <aside className="h-full w-full bg-black flex flex-col font-sans text-white">
      
      {/* Header Section */}
      <div className="p-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-[#BBFB00] rounded-sm flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-black" />
          </div>
          <div className="overflow-hidden">
            <p className="text-white font-bold text-sm tracking-wide truncate">
              Admin Panel
            </p>
            <p className="text-white/50 text-xs truncate">
              {user?.username || 'Admin User'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-colors border-l-2 ${
                isActive
                  ? "border-[#BBFB00] text-[#BBFB00] bg-white/5"
                  : "border-transparent text-white/60 hover:text-white hover:bg-white/5 hover:border-white/20"
              }`
            }
          >
            {/* Note: Ensure the icons inside your NAV_ITEMS array are imported from lucide-react */}
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-white/10 space-y-1 shrink-0">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Home className="w-4 h-4 shrink-0" />
          Back to Site
        </button>
        <button
          onClick={async () => {
            // await dispatch(logoutUser());
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-sm text-sm font-medium text-white/60 hover:text-red-400 hover:bg-white/5 transition-colors group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:-translate-x-1 transition-transform" />
          Logout
        </button>
      </div>
      
    </aside>
  );
};

export default AdminSidebar;
