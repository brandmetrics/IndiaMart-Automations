"use client";

import { useEffect, useState } from "react";
import LeadsTable from "@/components/LeadsTable";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export default function LeadsPage() {

  const [leads, setLeads] =
    useState([]);
    const [fromDate, setFromDate] = useState<Date | null>(null);
const [toDate, setToDate] = useState<Date | null>(null);
const [dateRange, setDateRange] = useState("all");

const fetchLeads = async () => {

  let url =
    `/api/leads?range=${dateRange}`;

  if (
    dateRange === "custom" &&
    fromDate &&
    toDate
  ) {

    const formattedFrom =
      fromDate
        .toISOString()
        .split("T")[0];

    const formattedTo =
      toDate
        .toISOString()
        .split("T")[0];

    url +=
      `&fromDate=${formattedFrom}&toDate=${formattedTo}`;
  }

  const res =
    await fetch(url);

  const data =
    await res.json();

  setLeads(data);
};

  useEffect(() => {
  fetchLeads();
}, []);

useEffect(() => {

  if (dateRange !== "custom") {

    fetchLeads();

  }

}, [dateRange]);

useEffect(() => {

  if (
    dateRange === "custom" &&
    fromDate &&
    toDate
  ) {

    fetchLeads();

  }

}, [fromDate, toDate]);

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6 text-black">
        Leads 
      </h1>

      <div className="flex items-center gap-4 mb-4">

  <select
    value={dateRange}
    onChange={(e) =>
      setDateRange(e.target.value)
    }
    className="border p-2 rounded text-black"
  >
    <option value="all">
      All Leads
    </option>

    <option value="today">
      Today
    </option>

    <option value="yesterday">
      Yesterday
    </option>

    <option value="7days">
      Last 7 Days
    </option>

    <option value="30days">
      Last 30 Days
    </option>

    <option value="custom">
      Custom Range
    </option>
  </select>

  {dateRange === "custom" && (
    <>
      <DatePicker
        selected={fromDate}
        onChange={(date: Date | null) =>
          setFromDate(date)
        }
        placeholderText="From Date"
        className="border p-2 rounded text-black"
      />

      <DatePicker
        selected={toDate}
        onChange={(date: Date | null) =>
          setToDate(date)
        }
        placeholderText="To Date"
        className="border p-2 rounded text-black"
      />
    </>
  )}

  {/* {
  dateRange === "custom" && (

    <button
      onClick={fetchLeads}
      className="bg-black text-white px-4 py-2 rounded"
    >
      Apply Filter
    </button>

  )
} */}

  <button
    onClick={() => {

      setDateRange("all");
      setFromDate(null);
      setToDate(null);

      fetch("/api/leads")
        .then(res => res.json())
        .then(data => setLeads(data));

    }}
    className="bg-gray-500 text-white px-4 py-2 rounded"
  >
    Reset
  </button>

</div>

</div>

      <LeadsTable
        leads={leads}
      />

    </div>

  );

}