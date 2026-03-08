import { useState, useCallback } from "react";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";

const useAdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await axiosInstance.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to fetch users";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const banUser = useCallback(async (id) => {
    try {
      const res = await axiosInstance.put(`/api/admin/users/${id}/ban`);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === id ? { ...u, isBanned: res.data.isBanned } : u,
        ),
      );
      toast.success(res.data.message);
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
      return { success: false };
    }
  }, []);

  const deleteUser = useCallback(async (id) => {
    try {
      await axiosInstance.delete(`/api/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User deleted successfully!");
      return { success: true };
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
      return { success: false };
    }
  }, []);

  return { users, isLoading, error, fetchUsers, banUser, deleteUser };
};

export default useAdminUsers;
