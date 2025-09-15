"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import BuyerClientComponent from "./BuyerClientComponent";
import BuyerHistory from "./BuyerHistory";

export default function BuyerWrapper({ initialBuyer }: { initialBuyer: any }) {
  const [buyer, setBuyer] = useState(initialBuyer);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await axios.get(`/api/buyer/history?id=${buyer.id}`);
      if (res.status === 200) {
        setHistory(res.data.data);
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []); // fetch on mount

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <BuyerClientComponent
        buyer={buyer}
        onBuyerUpdate={(updatedBuyer: any) => {
          setBuyer(updatedBuyer); 
          fetchHistory();
        }}
      />

      {loadingHistory ? (
        
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="animate-pulse h-20 rounded-xl bg-gray-100 border border-gray-200"
          />
        ))}
      </div>
   
      ) : (
        <BuyerHistory history={history} />
      )}
    </div>
  );
}
