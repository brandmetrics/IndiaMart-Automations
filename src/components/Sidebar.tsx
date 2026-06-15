"use client";

import Link from "next/link";
import {
  useEffect,
  useState,
} from "react";

import {
  LayoutDashboard,
  Users,
  Briefcase,
  Filter,
  Settings,
  LogOut,
} from "lucide-react";


export default function Sidebar() {

  const [user, setUser]: any =
    useState(null);

  useEffect(() => {

    const storedUser =
      localStorage.getItem(
        "user"
      );

    if (storedUser) {

      setUser(
        JSON.parse(
          storedUser
        )
      );

    }

  }, []);

  return (

    <div className="w-64 min-h-screen bg-black text-white p-6 flex flex-col justify-between">

      <div>

        <h1 className="text-3xl font-bold mb-10">
          CRM Panel
        </h1>

        <div className="flex flex-col gap-5">

          {/* DASHBOARD */}

          <Link
            href="/dashboard"
            className="flex items-center gap-3 hover:text-gray-300"
          >
            <LayoutDashboard size={18} />

            Dashboard
          </Link>

          {/* USERS → ADMIN ONLY */}

          {user?.role === "admin" && (

            <Link
              href="/dashboard/users"
              className="flex items-center gap-3 hover:text-gray-300"
            >
              <Users size={18} />

              Users
            </Link>

          )}

          

          {user?.role === "admin" && (
  <Link
    href="/dashboard/leads"
    className="flex items-center gap-3 hover:text-gray-300"
  >
    <Briefcase size={18} />
    Leads
  </Link>
)}

          {/* FILTERS → BOTH */}

          <Link
            href="/dashboard/filters"
            className="flex items-center gap-3 hover:text-gray-300"
          >
            <Filter size={18} />

            Filters
          </Link>


          {/* SETTINGS → ADMIN ONLY */}

          {user?.role === "admin" && (

            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 hover:text-gray-300"
            >
              <Settings size={18} />

              Settings
            </Link>

          )}

        </div>

      </div>

      {/* LOGOUT BUTTON */}

      <button
        className="flex items-center justify-center gap-2 bg-white text-black py-3 rounded-xl hover:bg-gray-200"
      >

        <LogOut size={18} />

        Logout

      </button>

    </div>

  );

}