"use client";

import { useEffect, useState } from "react";
import LeadsTable from "@/components/LeadsTable";

import { FaCalendarAlt } from "react-icons/fa";

import { DateRangePicker } from "react-date-range";

import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
export default function LeadsPage() {

  const [leads, setLeads] =
    useState([]);
   const [ranges, setRanges] = useState<any>([
  {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  },
]);

const selectedRange = ranges[0];

    
const [dateRange, setDateRange] = useState("thisMonth");
const today =
  new Date()
    .toLocaleDateString("en-GB")
    .replace(/\//g, "-");

const [dateLabel, setDateLabel] =
  useState(`${today} - ${today}`);
const [leadStatus, setLeadStatus] =
  useState("all");
  const [showMenu, setShowMenu] =
  useState(false);
  const [searchTerm, setSearchTerm] =
  useState("");

  const updateDateLabel = (
  range: string
) => {

  const today = new Date();

  if (range === "today") {

    const d =
      today
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

    setDateLabel(
      `${d} - ${d}`
    );
  }

  else if (
    range === "yesterday"
  ) {

    const yesterday =
      new Date();

    yesterday.setDate(
      yesterday.getDate() - 1
    );

    const d =
      yesterday
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

    setDateLabel(
      `${d} - ${d}`
    );
  }

  else if (range === "7days") {

  const today = new Date();

  const last7Days = new Date();

  last7Days.setDate(
    today.getDate() - 6
  );

  const from =
    last7Days
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  const to =
    today
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  setDateLabel(
    `${from} - ${to}`
  );
}

else if (range === "30days") {

  const today = new Date();

  const last30Days = new Date();

  last30Days.setDate(
    today.getDate() - 29
  );

  const from =
    last30Days
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  const to =
    today
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  setDateLabel(
    `${from} - ${to}`
  );
}

else if (range === "thisMonth") {

  const today = new Date();

  const firstDay =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

  const from =
    firstDay
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  const to =
    today
      .toLocaleDateString("en-GB")
      .replace(/\//g, "-");

  setDateLabel(
    `${from} - ${to}`
  );
}

  else if (
    range === "custom"
  ) {

    const from =
      selectedRange.startDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

    const to =
      selectedRange.endDate
        .toLocaleDateString("en-GB")
        .replace(/\//g, "-");

    setDateLabel(
      `${from} - ${to}`
    );
  }

};

const fetchLeads = async () => {

  let url =
    `/api/leads?range=${dateRange}`;

  if (dateRange === "custom") {

    const formattedFrom =
  selectedRange.startDate
    .toISOString()
    .split("T")[0];

const formattedTo =
  selectedRange.endDate
    .toISOString()
    .split("T")[0];

    url +=
      `&fromDate=${formattedFrom}&toDate=${formattedTo}`;
  }

  if (leadStatus !== "all") {

  url +=
    `&status=${leadStatus}`;
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

}, [dateRange, leadStatus]);

useEffect(() => {

  if (dateRange === "custom") {

    fetchLeads();

  }

}, [ranges]);

const filteredLeads =
  leads.filter((lead: any) =>
    lead.name
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      )
  );

  useEffect(() => {
  updateDateLabel("thisMonth");
}, []);

  return (

    <div className="p-6">

      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl shadow">

      <h1 className="text-3xl font-bold mb-6 text-black">
        Leads 
      </h1>

      <div className="flex items-center gap-4 mb-4">

<select
  value={leadStatus}
  onChange={(e) =>
    setLeadStatus(e.target.value)
  }
  className="border px-4 py-3 rounded-lg text-black bg-white min-w-[180px]"
>
  <option value="all">
    All Leads
  </option>

  <option value="yes">
    Useful Leads
  </option>

  <option value="no">
    Not Useful Leads
  </option>
</select>

<div className="relative">

  <button
    onClick={() => setShowMenu(!showMenu)}
    className="
      flex items-center gap-2
      border rounded-lg
      px-3 py-2
      bg-white text-black
      min-w-[260px]
    "
  >
    <FaCalendarAlt />

    <span>{dateLabel}</span>

    <span className="ml-auto">▼</span>
  </button>

  {showMenu && (

    <div
      className="
        absolute top-full mt-2 right-0
        bg-white border rounded-lg
        shadow-lg z-50
        w-60 text-black
      "
    >

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          setDateRange("today");
          updateDateLabel("today");
          setShowMenu(false);
        }}
      >
        Today
      </div>

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          setDateRange("yesterday");
          updateDateLabel("yesterday");
          setShowMenu(false);
        }}
      >
        Yesterday
      </div>

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
  setDateRange("7days");
  updateDateLabel("7days");
  setShowMenu(false);
}}
      >
        Last 7 Days
      </div>

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
  setDateRange("30days");
  updateDateLabel("30days");
  setShowMenu(false);
}}
      >
        Last 30 Days
      </div>

      <div
      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
  onClick={() => {
    setDateRange("thisMonth");
    updateDateLabel("thisMonth");
    setShowMenu(false);
  }}
>
  This Month
</div>

      <div
        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
        onClick={() => {
          setDateRange("custom");
        }}
      >
        Custom Range
      </div>

    </div>

  )}

{
  showMenu &&
  dateRange === "custom" && (

    <div className="absolute top-full mt-2 right-64 z-50">

      <DateRangePicker
        ranges={ranges}
        onChange={(item: any) => {

          setRanges([
            item.selection,
          ]);

          const from =
            item.selection.startDate
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-");

          const to =
            item.selection.endDate
              .toLocaleDateString("en-GB")
              .replace(/\//g, "-");

          setDateLabel(
            `${from} - ${to}`
          );
        }}
      />

    </div>

  )
}
</div>

<input
  type="text"
  placeholder="Search Lead"
  value={searchTerm}
  onChange={(e) =>
    setSearchTerm(e.target.value)
  }
  className=" border rounded-lg px-4 py-2 text-black bg-white"
/>
  <button
    onClick={() => {

      setDateRange("all");
      setLeadStatus("all");
      setDateLabel("Date Range");
      setRanges([
  {
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  },
]);
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
        leads={filteredLeads}
      />

    </div>

  );

}