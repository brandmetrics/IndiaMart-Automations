"use client";

import { FaEdit } from "react-icons/fa";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

type Props = {
  settings: any;
  setEditSetting: any;
  setEditValue: any;
};

export default function SettingsTable({

  settings,

  setEditSetting,

  setEditValue,

}: Props) {

    const [DataTable, setDataTable] =
  useState<any>(null);

const tableKey =
  useMemo(
    () =>
      settings
        .map(
          (setting: any) =>
            `${setting.id}:${setting.setting_key}`
        )
        .join("|"),
    [settings]
  );

  useEffect(() => {

  const load =
    async () => {

      const module =
        await import(
          "datatables.net-react"
        );

      const DT =
        await import(
          "datatables.net-dt"
        );

      await import(
        "datatables.net-dt/css/dataTables.dataTables.css"
      );

      const DataTableReact =
        module.default;

      DataTableReact.use(
        DT.default
      );

      setDataTable(
        () => DataTableReact
      );

    };

  load();

}, []);

if (!DataTable) {

  return (
    <p>Loading...</p>
  );

}

  return (

    <div className="bg-white rounded-2xl shadow-md p-4 text-black">

  <DataTable
    key={tableKey}
    className="display"
  >

    <thead>

      <tr>

        <th>ID</th>

        <th>Title</th>

        <th>Value</th>

        <th>Action</th>

      </tr>

    </thead>

    <tbody>

      {settings.map(
        (setting: any) => (

          <tr key={setting.id}>

            <td>
              {setting.id}
            </td>

            <td>
              {setting.setting_key}
            </td>

            <td>
              {setting.setting_value}
            </td>

            <td>

              <button

                onClick={() => {

                  setEditSetting(
                    setting
                  );

                  setEditValue(
                    setting.setting_value
                  );

                }}

                className="text-black"

              >

                <FaEdit />

              </button>

            </td>

          </tr>

        )
      )}

    </tbody>

  </DataTable>

</div>

  );

}