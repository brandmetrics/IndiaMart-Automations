"use client";

import { useEffect, useMemo, useState } from "react";

export type LeadRow = {
    id: number;
    unique_id: string;
    name: string;
    email: string;
    phone: string;
    query_message: string;
    useful_lead_status: number;
    updated_at: string;
};

type Props = {
    leads: LeadRow[];
};

export default function LeadsTable({
  leads,
}: Props) {

  const [DataTable, setDataTable] =
    useState<any>(null);

  const tableKey = useMemo(
    () =>
      leads
        .map(
          (lead) =>
            `${lead.id}:${lead.updated_at}`
        )
        .join("|"),
    [leads]
  );

  useEffect(() => {

    const loadDataTable = async () => {

      const module = await import(
        "datatables.net-react"
      );

      const DT = await import(
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

    loadDataTable();

  }, []);

  if (!DataTable) {

    return (
      <p className="text-black">
        Loading table...
      </p>
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

            <th>Unique ID</th>

            <th>Name</th>

            <th>Email Address</th>

            <th>Phone Number</th>

            <th>Query Message</th>

            <th>Useful Lead</th>

            <th>Last Updated</th>

          </tr>

        </thead>

        <tbody>

          {leads.map((lead) => (

            <tr key={lead.id}>

              <td>
                {lead.unique_id}
              </td>

              <td>
                {lead.name}
              </td>

              <td>
                {lead.email}
              </td>

              <td>
                {lead.phone}
              </td>

              <td>
                {lead.query_message}
              </td>

              <td>

                {lead.useful_lead_status === 1 ? (

                  <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
                    Yes
                  </span>

                ) : (

                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                    No
                  </span>

                )}

              </td>

              <td>
                {new Date(
                  lead.updated_at
                ).toLocaleString()}
              </td>

            </tr>

          ))}

        </tbody>

      </DataTable>

    </div>

  );

}