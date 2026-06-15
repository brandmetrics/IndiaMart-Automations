"use client";

import { useEffect, useState } from "react";
import LeadsTable from "@/components/LeadsTable";

export default function LeadsPage() {

  const [leads, setLeads] =
    useState([]);
    const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");

const fetchLeads = async () => {

  let url = "/api/leads";

  if (fromDate && toDate) {

    url +=
      `?fromDate=${fromDate}&toDate=${toDate}`;
  }

  const res = await fetch(url);

  const data = await res.json();

  setLeads(data);
};

  useEffect(() => {
  fetchLeads();
}, []);

  return (

    <div className="p-6">

      <h1 className="text-3xl font-bold mb-6 text-black">
        Leads 
      </h1>

      <div className="flex items-center gap-4 mb-4">

  <input
    type="date"
    value={fromDate}
    onChange={(e) =>
      setFromDate(e.target.value)
    }
    className="border p-2 rounded text-black"
  />

  <input
    type="date"
    value={toDate}
    onChange={(e) =>
      setToDate(e.target.value)
    }
    className="border p-2 rounded text-black"
  />

  <button
    onClick={fetchLeads}
    className="bg-black text-white px-4 py-2 rounded"
  >
    Apply Filter
  </button>

  <button
  onClick={() => {

    setFromDate("");
    setToDate("");

    fetch("/api/leads")
      .then(res => res.json())
      .then(data => setLeads(data));

  }}
  className="bg-gray-500 text-white px-4 py-2 rounded"
>
  Reset
</button>


</div>

      <LeadsTable
        leads={leads}
      />

    </div>

  );

}