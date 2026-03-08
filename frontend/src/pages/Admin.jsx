import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../admin/components/AdminLayout";
import AdminDashboard from "../admin/pages/AdminDashboard";
import AdminMovies from "../admin/pages/AdminMovies";
import AdminAddMovie from "../admin/pages/AdminAddMovie";
import AdminUsers from "../admin/pages/AdminUsers";

const Admin = () => {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="movies" element={<AdminMovies />} />
        <Route path="add" element={<AdminAddMovie />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  );
};

export default Admin;
