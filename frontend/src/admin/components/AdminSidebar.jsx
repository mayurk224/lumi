import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
    <aside className="fixed left-0 top-0 h-full w-64 bg-dark-200 border-r border-white/5 z-40 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
            <FiShield className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">Admin Panel</p>
            <p className="text-gray-500 text-xs">{user?.username}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? "bg-primary-500 text-white shadow-lg shadow-primary-500/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-1">
        <button
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <FiHome className="w-4 h-4" />
          Back to Site
        </button>
        <button
          onClick={async () => {
            await dispatch(logoutUser());
            navigate("/login");
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition-all"
        >
          <FiLogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
