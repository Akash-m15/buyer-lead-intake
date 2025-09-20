
"use client";


type HistoryChange = {
  field: string;
  old: any;
  new: any;
};

type BuyerHistoryEntry = {
  changedBy: string;
  changedAt: string;
  changes: HistoryChange[];
};

export default function BuyerHistory({
  history,
}: {
  history: BuyerHistoryEntry[];
}) {

 if (!history || history.length === 0) {
    return <div className="text-gray-500">No history available.</div>;
 }

  return (
    <section className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        History (Last 5 changes)
      </h3>

      <ul className="space-y-3">
        {history.map((entry, idx) => (
          <li
            key={idx}
            className="rounded-xl border border-gray-200 bg-white shadow-sm p-4"
          >
            <div className="mb-2 text-xs text-gray-500">
              Changed by{" "}
              <span className="font-medium text-gray-700">{entry.changedBy}</span>{" "}
              at{" "}
              <time className="text-gray-600">
                {new Date(entry.changedAt).toLocaleString()}
              </time>
            </div>

            <ul className="ml-4 list-disc text-sm text-gray-700 space-y-1">
              {entry.changes.map((change, i) => (
                <li key={i}>
                  <span className="font-medium">{change.field}:</span>{" "}
                  {change.old !== null ? (
                    <>
                      <span className="line-through text-red-500">{change.old}</span>{" "}
                      →{" "}
                    </>
                  ) : null}{" "}
                  <span className="text-green-600">{change.new}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </section>
  );
}
