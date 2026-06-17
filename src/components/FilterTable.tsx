"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  FaEdit,
  FaTrash,
} from "react-icons/fa";

type Props = {

  filters: any;

  setFilters: any;

  setEditFilter: any;

  setEditFilterName: any;

};

export default function FilterTable({

  filters,

  setFilters,

  setEditFilter,

  setEditFilterName,

}: Props) {

  const [DataTable, setDataTable] =
    useState<any>(null);

  const tableKey =
    useMemo(
      () =>
        filters
          .map(
            (filter: any) =>
              `${filter.id}:${filter.filter_name}`
          )
          .join("|"),
      [filters]
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

            <th>Filter Name</th>

            <th>User Name</th>

            <th>Created At</th>

            <th>Actions</th>

          </tr>

        </thead>

        <tbody>

          {filters.map(
            (filter: any) => (

              <tr key={filter.id}>

                <td>
                  {filter.id}
                </td>

                <td>
                  {filter.filter_name}
                </td>

                <td>
                  {filter.user_name}
                </td>

                <td>
                  {new Date(filter.created_at).toLocaleString(
  "en-IN",
  {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }
)}
                </td>

                <td>

                  <div className="flex gap-2">

                    <button

                      onClick={() => {

                        setEditFilter(
                          filter
                        );

                        setEditFilterName(
                          filter.filter_name
                        );

                      }}

                      className="text-black px-3 py-2 rounded flex items-center gap-2"
                      title="Edit filter"
                    >

                      <FaEdit />

                    </button>

                    <button

                      onClick={async () => {

                        const response =
                          await fetch(

                            `/api/filters/${filter.id}`,

                            {
                              method: "DELETE",
                            }

                          );

                        const result =
                          await response.json();

                        if (
                          result.success
                        ) {

                          setFilters(
                            (
                              prev: any
                            ) =>

                              prev.filter(
                                (
                                  f: any
                                ) =>

                                  f.id !==
                                  filter.id
                              )
                          );

                        }

                      }}

                      className="text-black px-3 py-2 rounded flex items-center gap-2"
                      title="Delete filter"
                    >

                      <FaTrash />

                    </button>

                  </div>

                </td>

              </tr>

            )
          )}

        </tbody>

      </DataTable>

    </div>

  );

}
