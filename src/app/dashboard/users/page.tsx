"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import UserTable, { type UserRow } from "@/components/UserTable";

export default function UsersPage() {
  const [showForm, setShowForm] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "user">("user");
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState<"admin" | "user">("user");
  const [passwordUser, setPasswordUser] = useState<UserRow | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users", {
        cache: "no-store",
      });
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || "Unable to load users");
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          role,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setUsers((prev) => [data.user, ...prev]);
        setShowForm(false);
        setUsername("");
        setEmail("");
        setPassword("");
        setRole("user");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editUser) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${editUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: editUsername,
          email: editEmail,
          role: editRole,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setUsers((prev) =>
          prev.map((user) => (user.id === data.user.id ? data.user : user))
        );
        setEditUser(null);
        setEditUsername("");
        setEditEmail("");
        setEditRole("user");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleDeleteUser = async (user: UserRow) => {
    const result = await Swal.fire({
      title: "Delete user?",
      text: `This will permanently delete ${user.email}.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Delete",
      confirmButtonColor: "#000000",
    });

    if (!result.isConfirmed) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!passwordUser) {
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(`/api/users/${passwordUser.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: newPassword,
        }),
      });
      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        setPasswordUser(null);
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="p-2">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-black">User Management</h1>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="rounded-lg bg-black px-5 py-2 text-white hover:bg-gray-800"
        >
          Add User
        </button>
      </div>

      <UserTable
        users={users}
        setEditUser={setEditUser}
        setEditUsername={setEditUsername}
        setEditEmail={setEditEmail}
        setEditRole={setEditRole}
        setPasswordUser={setPasswordUser}
        onDeleteUser={handleDeleteUser}
      />

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Add User</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xl text-gray-500"
              >
                X
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <select
                value={role}
                onChange={(e) => setRole(e.target.value as "admin" | "user")}
                className="w-full rounded-lg border p-3 text-black"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800"
              >
                Create User
              </button>
            </form>
          </div>
        </div>
      )}

      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Edit User</h2>
              <button
                type="button"
                onClick={() => setEditUser(null)}
                className="text-xl text-gray-500"
              >
                X
              </button>
            </div>

            <form onSubmit={handleUpdateUser} className="space-y-4">
              <input
                type="text"
                value={editUsername}
                onChange={(e) => setEditUsername(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value as "admin" | "user")}
                className="w-full rounded-lg border p-3 text-black"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button
                type="submit"
                className="w-full rounded-lg bg-black py-3 text-white hover:bg-gray-800"
              >
                Update User
              </button>
            </form>
          </div>
        </div>
      )}

      {passwordUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-[400px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">Change Password</h2>
              <button
                type="button"
                onClick={() => setPasswordUser(null)}
                className="text-xl text-gray-500"
              >
                X
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-lg border p-3 text-black"
              />

              <button
                type="submit"
                className="w-full rounded-lg bg-black py-3 text-white"
              >
                Update Password
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
