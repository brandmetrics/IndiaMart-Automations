"use client";

import {
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import SettingsTable from "@/components/SettingsTable";

export default function SettingsPage() {

  const router = useRouter();

  const [settings, setSettings]: any =
  useState([]);

const [editSetting, setEditSetting]: any =
  useState(null);

const [editValue, setEditValue] =
  useState("");

  // FETCH SETTINGS

const fetchSettings =
async () => {

  try {

    const response =
      await fetch(
        "/api/settings"
      );

    const data =
      await response.json();

    if (data.success) {

      setSettings(
        data.settings
      );

    }

  } catch (error) {

    console.log(error);

  }

};

const handleUpdateSetting =
async () => {

  try {

    const response =
      await fetch(

        `/api/settings/${editSetting.id}`,

        {

          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            setting_value:
              editValue,

          }),

        }

      );

    const data =
      await response.json();

    if (data.success) {

      toast.success(
        data.message
      );

      fetchSettings();

      setEditSetting(null);

      setEditValue("");

    } else {

      toast.error(
        data.message
      );

    }

  } catch (error) {

    toast.error(
      "Something went wrong"
    );

  }

};

 useEffect(() => {

  const storedUser =
    localStorage.getItem("user");

  if (!storedUser) {

    router.replace("/login");
    return;

  }

  const user =
    JSON.parse(storedUser);

  if (user.role !== "admin") {

    router.replace("/dashboard");
    return;

  }

  fetchSettings();

}, []);

  



  return (

    <div className="p-4">

      <div className="bg-white rounded-2xl shadow-md p-6 max-w-2xl">

        <h1 className="text-3xl font-bold text-black mb-6">

          Settings

        </h1>

        <SettingsTable

  settings={settings}

  setEditSetting={setEditSetting}

  setEditValue={setEditValue}

/>

      </div>

      {editSetting && (

<div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">

  <div className="bg-white p-6 rounded-xl w-[400px]">

    <h2 className="text-xl font-bold mb-4 text-black">

      Edit Setting

    </h2>

    <input

      value={
        editSetting.setting_key
      }

      readOnly

      className="w-full border p-3 mb-3 bg-gray-100 text-black"

    />

    <input

      value={editValue}

      onChange={(e) =>
        setEditValue(
          e.target.value
        )
      }

      className="w-full border p-3 mb-3 text-black"

    />

    <button

  onClick={
    handleUpdateSetting
  }

  className="bg-black text-white px-4 py-2 rounded"

>

  Update

</button>

  </div>

</div>

)}

    </div>

  );

}