"use client";

import Link from "next/link";

import {
  useEffect,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import toast from "react-hot-toast";

import {
  FaTachometerAlt,
  FaUsers,
  FaFilter,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser]: any =
    useState(null);

  const router =
    useRouter();

  // FETCH LOGGED IN USER

  useEffect(() => {

    fetch("/api/me")
      .then((res) => res.json())
      .then((data) => {

        if (data.success) {

          setUser(
            data.user
          );
        }
      });

  }, []);

  // LOGOUT FUNCTION

  const handleLogout =
    async () => {

      const response =
        await fetch(
          "/api/logout",
          {
            method: "POST",
          }
        );

      const data =
        await response.json();

      if (data.success) {

        toast.success(
          data.message
        );

        router.push(
          "/login"
        );
      }
    };

  return (

    <div className="flex min-h-screen">

      {/* SIDEBAR */}

      <div className="w-[250px] bg-black text-white p-6">

        <h2 className="text-2xl font-bold mb-8">
          CRM Panel
        </h2>

        <div className="flex flex-col gap-4">

          <Link
  href="/dashboard"
  className="flex items-center gap-3"
>
  <FaTachometerAlt />
  Dashboard
</Link>

          {/* ADMIN ONLY */}

          {user?.role === "admin" && (

            <Link
  href="/dashboard/users"
  className="flex items-center gap-3"
>
  <FaUsers />
  Users
</Link>

          )}

          <Link
  href="/dashboard/filters"
  className="flex items-center gap-3"
>
  <FaFilter />
  Filters
</Link>

          {user?.role === "admin" && (

            <Link
  href="/dashboard/settings"
  className="flex items-center gap-3"
>
  <FaCog />
  Settings
</Link>

          )}

          

          {/* LOGOUT BUTTON */}

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 mt-10 bg-gray-100 text-black px-1 py-2 rounded-lg hover:bg-gray-300"
          >
            <FaSignOutAlt />
            Logout
          </button>

        </div>

      </div>

      {/* MAIN CONTENT */}

      <div className="flex-1 p-8 bg-gray-100">

        {children}

      </div>

    </div>
  );
}
