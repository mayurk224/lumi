import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../../redux/authSlice";
import useAdminUsers from "../hooks/useAdminUsers";
import ConfirmDialog from "../../components/ConfirmDialog";
import EmptyState from "../../components/EmptyState";
import {
  FiUsers,
  FiSearch,
  FiUserX,
  FiUserCheck,
  FiTrash2,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";

const AdminUsers = () => {
  const currentUser = useSelector(selectUser);
  const { users, isLoading, fetchUsers, banUser, deleteUser } = useAdminUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterBanned, setFilterBanned] = useState("all");
  const [deletingUserId, setDeletingUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [banningUserId, setBanningUserId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    let list = [...users];
    if (searchQuery) {
      list = list.filter(
        (u) =>
          u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    if (filterRole !== "all") {
      list = list.filter((u) => u.role === filterRole);
    }
    if (filterBanned === "active") {
      list = list.filter((u) => !u.isBanned);
    }
    if (filterBanned === "banned") {
      list = list.filter((u) => u.isBanned);
    }
    return list;
  }, [users, searchQuery, filterRole, filterBanned]);

  const handleBan = async (userId) => {
    setBanningUserId(userId);
    await banUser(userId);
    setBanningUserId(null);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await deleteUser(deletingUserId);
    if (result.success) setDeletingUserId(null);
    setIsDeleting(false);
  };

  const formatDate = (id) => {
    try {
      return new Date(
        parseInt(id.substring(0, 8), 16) * 1000,
      ).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  const isSelf = (userId) => userId === currentUser?._id;

  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto">
      <ConfirmDialog
        isOpen={!!deletingUserId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingUserId(null)}
        title="Delete User"
        message="This will permanently delete the user and all their data. This cannot be undone."
        confirmLabel="Delete User"
        isLoading={isDeleting}
      />

      <div className="flex items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Users</h1>
          <p className="text-gray-400 text-sm mt-0.5">
            {users.length} total user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="p-2.5 bg-dark-300/50 hover:bg-dark-300 border border-white/10 text-gray-400 hover:text-white rounded-xl transition-all"
          title="Refresh"
        >
          <FiRefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by username or email..."
            className="w-full bg-dark-200 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 pl-11 text-sm focus:outline-none focus:border-primary-500 transition-all"
          />
        </div>

        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="bg-dark-200 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500 cursor-pointer"
        >
          <option value="all" className="bg-dark-200">
            All Roles
          </option>
          <option value="user" className="bg-dark-200">
            Users
          </option>
          <option value="admin" className="bg-dark-200">
            Admins
          </option>
        </select>

        <select
          value={filterBanned}
          onChange={(e) => setFilterBanned(e.target.value)}
          className="bg-dark-200 border border-white/10 text-gray-300 text-sm rounded-xl px-4 py-2.5 focus:outline-none focus:border-primary-500 cursor-pointer"
        >
          <option value="all" className="bg-dark-200">
            All Status
          </option>
          <option value="active" className="bg-dark-200">
            Active
          </option>
          <option value="banned" className="bg-dark-200">
            Banned
          </option>
        </select>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="h-16 bg-dark-200 rounded-2xl animate-pulse"
              />
            ))}
        </div>
      ) : users.length === 0 ? (
        <EmptyState
          icon={<FiUsers className="w-10 h-10" />}
          title="No users found"
          subtitle="There are no users registered yet."
        />
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">No users match your filters</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilterRole("all");
              setFilterBanned("all");
            }}
            className="mt-3 text-primary-400 hover:text-primary-300 text-sm transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="bg-dark-200 border border-white/5 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <div className="col-span-4">User</div>
            <div className="col-span-3">Email</div>
            <div className="col-span-1">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-1">Joined</div>
            <div className="col-span-1 text-right">Actions</div>
          </div>

          <div className="divide-y divide-white/5">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`grid grid-cols-12 gap-4 px-5 py-4 items-center hover:bg-white/2 transition-colors
                ${user.isBanned ? "opacity-60" : ""}`}
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                    ${user.role === "admin" ? "bg-yellow-500/20 text-yellow-400" : "bg-primary-500/20 text-primary-400"}`}
                  >
                    {user.username?.[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium truncate">
                        {user.username}
                      </p>
                      {isSelf(user._id) && (
                        <span className="bg-primary-500/20 text-primary-400 text-xs px-1.5 py-0.5 rounded-full border border-primary-500/30">
                          You
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-span-3 min-w-0">
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>

                <div className="col-span-1">
                  {user.role === "admin" ? (
                    <span className="flex items-center gap-1 text-yellow-400 text-xs font-medium">
                      <FiShield className="w-3 h-3" /> Admin
                    </span>
                  ) : (
                    <span className="text-gray-500 text-xs">User</span>
                  )}
                </div>

                <div className="col-span-2">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-full
                    ${
                      user.isBanned
                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                        : "bg-green-500/20 text-green-400 border border-green-500/30"
                    }`}
                  >
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </div>

                <div className="col-span-1">
                  <p className="text-gray-600 text-xs">
                    {formatDate(user._id)}
                  </p>
                </div>

                <div className="col-span-1 flex items-center justify-end gap-1">
                  {!isSelf(user._id) && user.role !== "admin" && (
                    <>
                      <button
                        onClick={() => handleBan(user._id)}
                        disabled={banningUserId === user._id}
                        className={`p-1.5 rounded-lg transition-all disabled:opacity-50
                          ${
                            user.isBanned
                              ? "text-green-400 hover:bg-green-500/10"
                              : "text-orange-400 hover:bg-orange-500/10"
                          }`}
                        title={user.isBanned ? "Unban user" : "Ban user"}
                      >
                        {banningUserId === user._id ? (
                          <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : user.isBanned ? (
                          <FiUserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <FiUserX className="w-3.5 h-3.5" />
                        )}
                      </button>

                      <button
                        onClick={() => setDeletingUserId(user._id)}
                        className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                        title="Delete user"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {isSelf(user._id) && (
                    <span className="text-gray-700 text-xs px-2">—</span>
                  )}
                  {!isSelf(user._id) && user.role === "admin" && (
                    <span className="text-gray-700 text-xs px-2">
                      Protected
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="px-5 py-3 border-t border-white/5 bg-dark-300/10">
            <p className="text-gray-600 text-xs">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
