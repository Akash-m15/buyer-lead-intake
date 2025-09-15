"use client";

type HistoryChange = {
  field: string
  old: any
  new: any
}

type BuyerHistoryEntry = {
  changedBy: string
  changedAt: string
  changes: HistoryChange[]
}
export default function BuyerHistory({ history} : { history: BuyerHistoryEntry[] }) {
  if (!history || history.length === 0) {
    return <p>No history available</p>;
  }

 

  return (
    <div className="buyer-history">
      <h3 className="text-lg font-bold mb-2">History (Last 5 changes)</h3>
      <ul>
        {history.map((entry, idx) => (
          <li key={idx} className="mb-4 border p-2 rounded-md bg-gray-50">
            <div className="mb-1 text-sm text-gray-500">
              Changed by <strong>{entry.changedBy}</strong> at{" "}
              {new Date(entry.changedAt).toLocaleString()}
            </div>
            <ul className="ml-4 list-disc">
              {entry.changes.map((change, i) => (
                <li key={i}>
                  <strong>{change.field}:</strong>{" "}
                  {change.old !== null ? `${change.old} → ` : ""}{change.new}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
