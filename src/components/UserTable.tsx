"use client";

import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaKey, FaTrash } from "react-icons/fa";

export type UserRow = {
  id: number;
  username: string;
  email: string;
  role: "admin" | "user";
};

type Props = {
  users: UserRow[];
  setEditUser: (user: UserRow) => void;
  setEditUsername: (username: string) => void;
  setEditEmail: (email: string) => void;
  setEditRole: (role: "admin" | "user") => void;
  setPasswordUser: (user: UserRow) => void;
  onDeleteUser: (user: UserRow) => void;
};

export default function UserTable({
  users,
  setEditUser,
  setEditUsername,
  setEditEmail,
  setEditRole,
  setPasswordUser,
  onDeleteUser,
}: Props) {
  const [DataTable, setDataTable] = useState<any>(null);
  const tableKey = useMemo(
    () => users.map((user) => `${user.id}:${user.email}:${user.role}`).join("|"),
    [users]
  );

  useEffect(() => {
    const loadDataTable = async () => {
      const module = await import("datatables.net-react");
      const DT = await import("datatables.net-dt");

      await import("datatables.net-dt/css/dataTables.dataTables.css");

      const DataTableReact = module.default;

      DataTableReact.use(DT.default);
      setDataTable(() => DataTableReact);
    };

    loadDataTable();
  }, []);

  if (!DataTable) {
    return <p className="text-black">Loading table...</p>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 text-black">
      <DataTable key={tableKey} className="display">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>
                {user.role === "admin" ? (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Admin
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                    User
                  </span>
                )}
              </td>

              <td>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditUser(user);
                      setEditUsername(user.username || "");
                      setEditEmail(user.email || "");
                      setEditRole(user.role || "user");
                    }}
                    className="text-black px-3 py-2 rounded flex items-center gap-2"
                    title="Edit user"
                  >
                    <FaEdit />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDeleteUser(user)}
                    className="text-black px-3 py-2 rounded flex items-center gap-2"
                    title="Delete user"
                  >
                    <FaTrash />
                  </button>

                  <button
                    type="button"
                    onClick={() => setPasswordUser(user)}
                    className="text-black px-3 py-2 rounded flex items-center gap-2"
                    title="Change password"
                  >
                    <FaKey />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </DataTable>
    </div>
  );
}
