"use client";

import axios from "axios";
import { Chela_One } from "next/font/google";
import { useState, useEffect } from "react";
import { set } from "zod";

export default function buyerLeadsPage() {
  const [buyers, setBuyers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const pagesize = process.env.NEXT_PUBLIC_PAGESIZE || 10;
 

  useEffect(() => {
    const fetchBuyers = async () => {
      try {
        const res = await axios.get(
          `api/buyers/?page=${page}&pagesize=${pagesize}`
        );
        console.log(res.data)
        setBuyers(res.data.buyers);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.log(err);
      }
    };
    fetchBuyers();
  }, [page, pagesize]);



  return (
    <div>
      <div>
        <input type="text" placeholder="Search..." value={query} onChange={(e) =>{
          setPage(1);
          setQuery(e.target.value)} 
        }  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm sm:w-1/3"
        />
      </div>
      {/*Filter functionality to be implemented later*/ }
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
          { buyers.length === 0 ? (
            <tr><td colSpan={8}>No data found</td></tr>
          ) :( buyers.map((buyer : any) =>{
            return(
              <tr key={buyer.id}>
                <td>{buyer.fullName}</td>
                <td>{buyer.phone}</td>
                <td>{buyer.city}</td>
                <td>{buyer.propertyType}</td>
                <td>{buyer.budgetMin} - {buyer.budgetMax}</td>
                <td>{buyer.timeline}</td>
                <td>{buyer.status}</td>
                <td>{new Date(buyer.updatedAt).toLocaleDateString('en-IN')}</td>
              </tr>
            )
          }) )}
        </tbody>
      </table>
    </div>
    <div>
      <button disabled = {page == 1} onClick={ () => setPage((page) => page - 1)}
      >Prev</button>
      <span>Page {page} of {totalPages}</span>
      <button disabled = {page == totalPages} onClick={ () => setPage((page) => page + 1)}
      >Next</button>
    </div>
    </div>
  );
}
