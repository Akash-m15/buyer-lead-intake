"use client";

import LogoutButton from "@/components/LogOutButton";
import { BuyerLeadType } from "@/lib/validation/buyer";
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
      console.log(res.data);
      setBuyers(res.data.buyers);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      console.log(err);
    }
  };

  //Only use Debounce for query change
  useEffect(() => {
    const getData = setTimeout(() => {
      fetchBuyers();
    }, 600);
    return () => clearTimeout(getData);
  }, [query]);

  //Immediate for change in page or pagesize
  useEffect(() => {
    fetchBuyers();
  }, [page, pagesize, isFilterOpen]);

  const exportCSV = async () => {
  try {
    // Fetch all filtered buyers
    const res = await axios.get("/api/buyers", {
      params: {
        query,
        cities,
        propertyTypes,
        statuses,
        timelines,
        // no page or pagesize so fetch all records 
        all: true,
      },
    });

    const buyersData = res.data.buyers;

    const headers = "fullName,email,phone,city,propertyType,bhk,purpose,budgetMin,budgetMax,timeline,source,notes,tags,status\n";

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
          b.status
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


  return (
    <div>
      <div className=" border bg-red-400 text-white right-0 mt--10">
        <LogoutButton />
      </div>
      <div>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => {
            setPage(1);
            setQuery(e.target.value);
          }}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-1/3"
        />
      </div>
      <div>
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="mt-2 rounded-md bg-blue-500 px-3 py-1 text-sm text-white"
        >
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
        {isFilterOpen && (
          <div>
            <div>
              <h3>City</h3>
              {["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"].map(
                (city) => (
                  <label key={city} className="mr-2">
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
              <h3>City</h3>
              {["Apartment", "Office", "Villa", "Plot", "Retail"].map(
                (property) => (
                  <label key={property} className="mr-2">
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
            <button
              onClick={() => {
                setIsFilterOpen(false);
              }}
            >
              Apply Filters
            </button>
          </div>
        )}
      </div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>City</th>
              <th>Property Type</th>
              <th>Budget</th>
              <th>TimeLine</th>
              <th>Status</th>
              <th>Updated at</th>
            </tr>
          </thead>
          <tbody>
            {buyers.length === 0 ? (
              <tr>
                <td colSpan={8}></td>
              </tr>
            ) : (
              buyers.map((buyer: any) => {
                return (
                  <tr key={buyer.id}>
                    <td>{buyer.fullName}</td>
                    <td>{buyer.phone}</td>
                    <td>{buyer.city}</td>
                    <td>{buyer.propertyType}</td>
                    <td>
                      {buyer.budgetMin} - {buyer.budgetMax}
                    </td>
                    <td>{buyer.timeline}</td>
                    <td>{buyer.status}</td>
                    <td>
                      {new Date(buyer.updatedAt).toLocaleDateString("en-IN")}
                    </td>
                    <td>
                      <Link
                        href={`/buyers/${buyer.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        View / Edit
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-center gap-2">
        <button
          disabled={page == 1}
          onClick={() => setPage((page) => page - 1)}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
        >
          Prev
        </button>
        <span className="px-2 py-1 text-sm text-gray-600">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page == totalPages}
          onClick={() => setPage((page) => page + 1)}
          className="rounded-md border border-gray-300 px-3 py-1 text-sm disabled:opacity-50"
        >
          Next
        </button>

        <div>
          <button
            onClick={exportCSV}
            className="mt-2 rounded-md bg-green-500 px-3 py-1 text-sm text-white"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}
