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
    source: string;
    created_at: string;
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
         options={{
    pageLength: 15,
    lengthChange: false,
    searching: false,
  }}
      >

        <thead>

          <tr>

            <th>Unique ID</th>

            <th>Name</th>

            <th>Email Address</th>

            <th>Phone Number</th>

            <th>Query Message</th>

            <th>Useful Lead</th>

            <th>Source</th>

            <th>Created At</th>

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

              <td>{lead.source}</td>

              <td>
  {new Date(lead.created_at).toLocaleString(
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

            </tr>

          ))}

        </tbody>

      </DataTable>

    </div>

  );

}