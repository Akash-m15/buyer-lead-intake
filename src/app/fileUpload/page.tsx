// "use client";

// import axios from "axios";
// import React, { useState } from "react";

// export default function FileUpload() {
//   const [file, setFile] = useState<File | null>(null);
  
//   const [errors, setErrors] = useState<any[]>([]);
//   const [success, setSuccess] = useState<string | null>(null);

//   async function handleImport() {
//     if (!file) {
//       alert("Please select a file first.");
//       return;
//     }

//     try {
//       const text = await file.text();
//       const res = await axios.post("/api/buyers/import", text, {
//         headers: { "Content-Type": "text/plain" },
//       });
//        setErrors(res.data.errors || []);
//       setSuccess(`${res.data.inserted} rows imported successfully`);
//     } catch (err:any) {
//      setSuccess(null);
//       setErrors([{ row: "-", message: err.response?.data?.error || "Upload failed" }]);
//     }
//   }

//   function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
//     if (event.target.files && event.target.files.length > 0) {
//       setFile(event.target.files[0]);
//     }
//   }

//   return (
//     <div className="flex items-center space-x-4">
//       {/* Hidden input */}
//       <input
//         id="file-upload"
//         type="file"
//         accept=".csv"
//         onChange={handleFileChange}
//         className="hidden"
//       />

//       {/* Label styled like a button */}
//       <label
//         htmlFor="file-upload"
//         className="cursor-pointer flex items-center justify-center w-32 px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 hover:bg-gray-200"
//       >
//         <span className="text-xl font-bold mr-2">+</span>
//         <span>Upload</span>
//       </label>

//       {/* Import button */}
//       <button
//         onClick={handleImport}
//         className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-300"
//         disabled={!file}
//       >
//         Import
//       </button>

//       {/* Show selected file name */}
//       {file && <span className="text-lg font-bold font-mono ">{file.name}</span>}
//       <div>
        
//       {success && <p className="text-green-600">{success}</p>}

//       {errors.length > 0 && (
//         <div className="mt-4 border border-red-400 rounded p-2">
//           <h3 className="font-semibold text-red-600">Errors:</h3>
//           <ul className="list-disc list-inside text-sm text-red-500">
//             {errors.map((err, i) => (
//               <li key={i}>
//                 Row {err.row}: {err.message}
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}
//       </div>
//     </div>
//   );
// }
"use client";

import axios from "axios";
import React, { useState } from "react";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<any[]>([]);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleImport() {
    if (!file) {
      alert("Please select a file first.");
      return;
    }

    try {
      const text = await file.text();
      const res = await axios.post("/api/buyers/import", text, {
        headers: { "Content-Type": "text/plain" },
      });
      setErrors(res.data.errors || []);
      setSuccess(`${res.data.inserted} rows imported successfully`);
    } catch (err: any) {
      setSuccess(null);
      setErrors([
        { row: "-", message: err.response?.data?.error || "Upload failed" },
      ]);
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mt-10 gap-6 p-8 bg-white shadow-lg rounded-2xl border border-gray-200 w-full max-w-3xl mx-auto">
      {/* Hidden input */}
      <input
        id="file-upload"
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Controls */}
      <div className="flex items-center gap-6">
        {/* Upload Button */}
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex items-center justify-center gap-3 px-6 py-4 rounded-xl border border-dashed border-gray-400 bg-gray-50 text-gray-700 font-medium hover:bg-gray-100 hover:border-green-500 hover:text-green-600 transition-all"
        >
          <span className="text-3xl font-bold text-green-600">+</span>
          <span>Upload CSV</span>
        </label>

        {/* Import Button */}
        <button
          onClick={handleImport}
          className={`px-6 py-3 rounded-xl font-semibold shadow-md transition-all ${
            file
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
          disabled={!file}
        >
          Import
        </button>
      </div>

      {/* Selected File */}
      {file && (
        <div className="flex items-center text-base font-bold text-gray-700 truncate max-w-sm">
          <svg
            className="w-5 h-5 mr-2 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          {file.name}
        </div>
      )}

      {/* Success Message */}
      {success && (
        <div className="text-green-700 font-medium bg-green-50 border border-green-200 px-4 py-2 rounded-lg shadow-sm">
          {success}
        </div>
      )}

      {/* Error List */}
      {errors.length > 0 && (
        <div className="w-full mt-4 border border-red-300 bg-red-50 rounded-lg p-4">
          <h3 className="font-semibold text-red-700 mb-2">Errors:</h3>
          <ul className="space-y-1 text-sm text-red-600">
            {errors.map((err, i) => (
              <li
                key={i}
                className="flex items-start gap-2 border-b border-red-100 pb-1 last:border-b-0"
              >
                <span className="font-bold">Row {err.row}:</span>
                <span>{err.message}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
