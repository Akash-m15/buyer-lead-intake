"use client";

import LogoutButton from "@/components/LogOutButton";
import TableShimmerComponent from "@/components/TableShimmerComponent";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function BuyerLeadsPage() {
  const [buyers, setBuyers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [timelines, setTimelines] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pagesize = process.env.NEXT_PUBLIC_PAGESIZE || 10;

  const router = useRouter();

  const fetchBuyers = async () => {
    try {
      const res = await axios.get(`api/buyers/`, {
        params: {
          page,
          pagesize,
          query,
          cities,
          propertyTypes,
        },
      });

      if (res.status === 401) {
        alert("Unauthenticated");
        router.push("/signin");
      }
      setBuyers(res.data.buyers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  // debounce query
  useEffect(() => {
    const getData = setTimeout(() => {
      fetchBuyers();
    }, 600);
    return () => clearTimeout(getData);
  }, [query]);

  // immediate on page/filter
  useEffect(() => {
    fetchBuyers();
  }, [page, pagesize, isFilterOpen]);

  const exportCSV = async () => {
    try {
      const res = await axios.get("/api/buyers", {
        params: {
          query,
          cities,
          propertyTypes,
          statuses,
          timelines,
          all: true,
        },
      });

      const buyersData = res.data.buyers;

      const headers =
        "fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status\n";

      const rows = buyersData
        .map((b: any) =>
          [
            b.fullName,
            b.email ?? "",
            b.phone ?? "",
            b.city,
            b.propertyType,
            b.bhk ?? "",
            b.purpose,
            b.budgetMin ?? "",
            b.budgetMax ?? "",
            b.timeline,
            b.source,
            b.notes ?? "",
            (b.tags || []).join(","),
            b.status,
          ]
            .map((val) => `"${String(val).replace(/"/g, '""')}"`)
            .join(",")
        )
        .join("\n");

      const csvContent = headers + rows;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "buyers.csv";
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export CSV:", err);
    }
  };

  // timeline display formatter
  const formatTimeline = (t: string) => {
    switch (t) {
      case "ZERO_TO_THREE":
        return "0-3m";
      case "THREE_TO_SIX":
        return "3-6m";
      case "MORE_THAN_SIX":
        return ">6m";
      case "EXPLORING":
        return "Exploring";
      default:
        return t;
    }
  };

  return (
    <div className="p-4 mb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between bg-white px-6 py-4 shadow-sm border-b border-gray-200">
        <h1 className="text-xl font-bold">Lead-System</h1>
        <div className="flex items-center gap-4">
          <Link
            href="/create_lead"
            className="rounded-md bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
          >
            Create Lead
          </Link>
          <LogoutButton />
        </div>
      </div>

      {/* Search + Filters + Export */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-4 ml-10">
          <input
            type="text"
            placeholder="Search buyers..."
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            className="w-80 rounded-md border border-gray-300 px-3 py-2 text-base text-center"
          />
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="rounded-md bg-gray-700 px-3 py-2 text-sm text-white hover:bg-gray-900"
          >
            {isFilterOpen ? "Done" : "Show Filters"}
          </button>
        </div>

        <button
          onClick={exportCSV}
          className="rounded-md bg-green-500 px-4 py-2 text-sm font-medium text-white hover:bg-green-600"
        >
          Export CSV
        </button>
      </div>

      {/* Filters (collapsible with animation) */}
      <div
        className={`transition-all duration-500 overflow-hidden ${
          isFilterOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
        }`}
      >
        <div className="rounded-md border border-gray-200 bg-gray-50 p-4">
          <div className="mb-2">
            <h3 className="font-semibold mb-1">City</h3>
            {["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"].map(
              (city) => (
                <label key={city} className="mr-3 text-sm">
                  <input
                    type="checkbox"
                    checked={cities.includes(city)}
                    onChange={(e) => {
                      setPage(1);
                      if (e.target.checked) {
                        setCities([...cities, city]);
                      } else {
                        setCities(cities.filter((c) => c !== city));
                      }
                    }}
                  />
                  <span className="ml-1">{city}</span>
                </label>
              )
            )}
          </div>

          <div>
            <h3 className="font-semibold mb-1">Property Type</h3>
            {["Apartment", "Office", "Villa", "Plot", "Retail"].map(
              (property) => (
                <label key={property} className="mr-3 text-sm">
                  <input
                    type="checkbox"
                    checked={propertyTypes.includes(property)}
                    onChange={(e) => {
                      setPage(1);
                      if (e.target.checked) {
                        setPropertyTypes([...propertyTypes, property]);
                      } else {
                        setPropertyTypes(
                          propertyTypes.filter((c) => c !== property)
                        );
                      }
                    }}
                  />
                  <span className="ml-1">{property}</span>
                </label>
              )
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-md overflow-x-auto mt-6">
        <table className="w-full border-collapse text-base">
          <thead>
            <tr className="bg-gray-100 text-left text-gray-700 border-b border-gray-200">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">City</th>
              <th className="px-4 py-3">Property Type</th>
              <th className="px-4 py-3">Budget</th>
              <th className="px-4 py-3">Timeline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Updated At</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 ? (
                 <TableShimmerComponent />
            ) : (
              buyers.map((buyer: any) => (
                <tr
                  key={buyer.id}
                  className="border-b border-gray-200 last:border-0 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium">{buyer.fullName}</td>
                  <td className="px-4 py-3">{buyer.phone}</td>
                  <td className="px-4 py-3">{buyer.city}</td>
                  <td className="px-4 py-3">{buyer.propertyType}</td>
                  <td className="px-4 py-3">
                    {buyer.budgetMin} - {buyer.budgetMax}
                  </td>
                  <td className="px-4 py-3">{formatTimeline(buyer.timeline)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        buyer.status === "New"
                          ? "bg-yellow-100 text-yellow-800"
                          : buyer.status === "Closed"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {buyer.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {new Date(buyer.updatedAt).toLocaleDateString("en-IN")}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/buyers/${buyer.id}`}
                      className="text-blue-500 hover:underline"
                    >
                      View / Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-3">
        <button
          disabled={page == 1}
          onClick={() => setPage((page) => page - 1)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-2 text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page == totalPages}
          onClick={() => setPage((page) => page + 1)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
