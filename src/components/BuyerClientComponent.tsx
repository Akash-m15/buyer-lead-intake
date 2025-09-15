// "use client"

// import axios from "axios";
// import { useState } from "react";

// export default function BuyerClientComponent({ buyer }: any) {

//   const [isEditing, setIsEditing] = useState(false);
// console.log(buyer)
//  const handleSubmit = async( e: React.FormEvent) =>
//  {
//   e.preventDefault();
//   // console.log("Form Submitted")
//   const formData = new FormData(e.currentTarget as HTMLFormElement);
//   const rawData = Object.fromEntries(formData.entries());
//   // console.log(rawData);
//   try{

//     const res = await axios.put(`../api/buyer?id=${buyer.id}`,rawData);
//     console.log(res.data);
//   }catch(err)
//   {
//     console.log(err)
//   }
  
//  }

//   return (
//     <div>
//       {isEditing ? (<form onSubmit={handleSubmit}>
  
//   <input type="hidden" name="updatedAt" value={buyer.updatedAt.toISOString()} />

  
//   <label>
//     Full Name
//     <input
//       type="text"
//       name="fullName"
//       defaultValue={buyer.fullName}
//       required
//     />
//   </label>


//   <label>
//     Email
//     <input
//       type="email"
//       name="email"
//       defaultValue={buyer.email ?? ""}
//     />
//   </label>

 
//   <label>
//     Phone
//     <input
//       type="tel"
//       name="phone"
//       defaultValue={buyer.phone}
//       required
//     />
//   </label>

  
//   <label>
//     City
//     <select name="city" defaultValue={buyer.city}>
//       <option value="Chandigarh">Chandigarh</option>
//       <option value="Mohali">Mohali</option>
//       <option value="Zirakpur">Zirakpur</option>
//       <option value="Panchkula">Panchkula</option>
//       <option value="Other">Other</option>
//     </select>
//   </label>

  
//   <label>
//     Property Type
//     <select name="propertyType" defaultValue={buyer.propertyType}>
//       <option value="Apartment">Apartment</option>
//       <option value="Villa">Villa</option>
//       <option value="Plot">Plot</option>
//       <option value="Office">Office</option>
//       <option value="Retail">Retail</option>
//     </select>
//   </label>

  
//   <label>
//     BHK
//     <select name="bhk" defaultValue={buyer.bhk ?? ""}>
//       <option value="">--</option>
//       <option value="Studio">Studio</option>
//       <option value="One">1 BHK</option>
//       <option value="Two">2 BHK</option>
//       <option value="Three">3 BHK</option>
//       <option value="Four">4 BHK</option>
//     </select>
//   </label>

//   {/* Purpose */}
//   <label>
//     Purpose
//     <select name="purpose" defaultValue={buyer.purpose}>
//       <option value="Buy">Buy</option>
//       <option value="Rent">Rent</option>
//     </select>
//   </label>

  
//   <label>
//     Budget Min
//     <input
//       type="number"
//       name="budgetMin"
//       defaultValue={buyer.budgetMin ?? ""}
//     />
//   </label>
//   <label>
//     Budget Max
//     <input
//       type="number"
//       name="budgetMax"
//       defaultValue={buyer.budgetMax ?? ""}
//     />
//   </label>


//   <label>
//     Timeline
//     <select name="timeline" defaultValue={buyer.timeline}>
//       <option value="ZERO_TO_THREE">0–3 months</option>
//       <option value="THREE_TO_SIX">3–6 months</option>
//       <option value="MORE_THAN_SIX">More than 6 months</option>
//       <option value="EXPLORING">Exploring</option>
//     </select>
//   </label>

  
//   <label>
//     Source
//     <select name="source" defaultValue={buyer.source}>
//       <option value="Website">Website</option>
//       <option value="Referral">Referral</option>
//       <option value="WalkIn">Walk In</option>
//       <option value="Call">Call</option>
//       <option value="Other">Other</option>
//     </select>
//   </label>

 
//   <label>
//     Status
//     <select name="status" defaultValue={buyer.status}>
//       <option value="New">New</option>
//       <option value="Qualified">Qualified</option>
//       <option value="Contacted">Contacted</option>
//       <option value="Visited">Visited</option>
//       <option value="Negotiation">Negotiation</option>
//       <option value="Converted">Converted</option>
//       <option value="Dropped">Dropped</option>
//     </select>
//   </label>


//   <label>
//     Notes
//     <textarea name="notes" defaultValue={buyer.notes ?? ""} />
//   </label>

  
//   <label>
//     Tags
//     <input
//       type="text"
//       name="tags"
//       defaultValue={buyer.tags?.join(", ") ?? ""}
//       placeholder="comma separated"
//     />
//   </label>

  
//   <button type="submit" className="m-2 p-2 border-amber-100 text-blue-400">Save</button>
//   <button type="button" onClick={() => setIsEditing(false)}>
//     Cancel
//   </button>
// </form>
// ) : (
//       <div>
//       <div>
//         <h1>{buyer.fullName}</h1>
//         <span>{buyer.status}</span>
//         <span>{buyer.ownerId}</span>
//       </div>
//       <div>
//         <span>{buyer.phone}</span>
//         <span>{buyer.email}</span>
//       </div>
//       <div>
//         <p>{buyer.city}</p>
//         <p>{buyer.budget}</p>
//         <p>{buyer.propertyType}</p>
//         <p>{buyer.bhk}</p>
//         <p>{buyer.timeline}</p>
//       </div>
//       <div>
//         <p>{buyer.source}</p>
//         <p>{buyer.tags}</p>
//         <p>{buyer.notes}</p>
//       </div>
//     </div>
//       )
//     }
//     <button onClick={()=>setIsEditing(!isEditing)} className="border bg-amber-100 text-black w-18 p-2 rounded-xl">Edit</button>
//     </div>
//   );
// }
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useReducer, useState } from "react";

export default function BuyerClientComponent({
  buyer,
  onBuyerUpdate,
}: {
  buyer: any;
  onBuyerUpdate?: (updatedBuyer: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const rawData = Object.fromEntries(formData.entries());
    try {
      const res = await axios.put(`../api/buyer?id=${buyer.id}`, rawData);
      setIsEditing(false);
     if (onBuyerUpdate) onBuyerUpdate(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Timeline formatter
  const formatTimeline = (t: string) => {
    switch (t) {
      case "ZERO_TO_THREE":
        return "0–3m";
      case "THREE_TO_SIX":
        return "3–6m";
      case "MORE_THAN_SIX":
        return ">6m";
      case "EXPLORING":
        return "Exploring";
      default:
        return t;
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-3">
        <h1 className="text-2xl font-bold text-gray-800">{buyer.fullName}</h1>
        {!isEditing && (
          <span
            className={`px-3 py-1 rounded-full text-sm font-semibold ${
              buyer.status === "New"
                ? "bg-yellow-100 text-yellow-800"
                : buyer.status === "Closed"
                ? "bg-green-100 text-green-800"
                : "bg-blue-100 text-blue-800"
            }`}
          >
            {buyer.status}
          </span>
        )}
      </div>

      {/* Edit / Display */}
      {isEditing ? (
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          <input
            type="hidden"
            name="updatedAt"
            value={buyer.updatedAt.toISOString()}
          />

          {/** Basic Info */}
          <label className="flex flex-col text-sm text-gray-600">
            Full Name
            <input
              type="text"
              name="fullName"
              defaultValue={buyer.fullName}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Email
            <input
              type="email"
              name="email"
              defaultValue={buyer.email ?? ""}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Phone
            <input
              type="tel"
              name="phone"
              defaultValue={buyer.phone}
              required
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            City
            <select
              name="city"
              defaultValue={buyer.city}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Chandigarh">Chandigarh</option>
              <option value="Mohali">Mohali</option>
              <option value="Zirakpur">Zirakpur</option>
              <option value="Panchkula">Panchkula</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Property Type
            <select
              name="propertyType"
              defaultValue={buyer.propertyType}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Apartment">Apartment</option>
              <option value="Villa">Villa</option>
              <option value="Plot">Plot</option>
              <option value="Office">Office</option>
              <option value="Retail">Retail</option>
            </select>
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            BHK
            <select
              name="bhk"
              defaultValue={buyer.bhk ?? ""}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">--</option>
              <option value="Studio">Studio</option>
              <option value="One">1 BHK</option>
              <option value="Two">2 BHK</option>
              <option value="Three">3 BHK</option>
              <option value="Four">4 BHK</option>
            </select>
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Purpose
            <select
              name="purpose"
              defaultValue={buyer.purpose}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="Buy">Buy</option>
              <option value="Rent">Rent</option>
            </select>
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Budget Min
            <input
              type="number"
              name="budgetMin"
              defaultValue={buyer.budgetMin ?? ""}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Budget Max
            <input
              type="number"
              name="budgetMax"
              defaultValue={buyer.budgetMax ?? ""}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600">
            Timeline
            <select
              name="timeline"
              defaultValue={buyer.timeline}
              className="mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="ZERO_TO_THREE">0–3 months</option>
              <option value="THREE_TO_SIX">3–6 months</option>
              <option value="MORE_THAN_SIX">More than 6 months</option>
              <option value="EXPLORING">Exploring</option>
            </select>
          </label>

          <label className="flex flex-col text-sm text-gray-600 col-span-2">
            Notes
            <textarea
              name="notes"
              defaultValue={buyer.notes ?? ""}
              className="mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700 min-h-[80px]"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-600 col-span-2">
            Tags
            <input
              type="text"
              name="tags"
              defaultValue={buyer.tags?.join(", ") ?? ""}
              placeholder="comma separated"
              className="mt-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-gray-50 text-gray-700"
            />
          </label>

          <div className="col-span-2 flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-gray-700">
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Phone</p>
            <p className="font-medium">{buyer.phone}</p>

            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{buyer.email}</p>

            <p className="text-sm text-gray-500">City</p>
            <p className="font-medium">{buyer.city}</p>

            <p className="text-sm text-gray-500">Budget</p>
            <p className="font-medium">
              {buyer.budgetMin} - {buyer.budgetMax}
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500">Property</p>
            <p className="font-medium">{buyer.propertyType}</p>

            <p className="text-sm text-gray-500">BHK</p>
            <p className="font-medium">{buyer.bhk}</p>

            <p className="text-sm text-gray-500">Timeline</p>
            <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
              {formatTimeline(buyer.timeline)}
            </span>

            <p className="text-sm text-gray-500">Source</p>
            <p className="font-medium">{buyer.source}</p>
          </div>

          <div className="col-span-2 space-y-2">
            <p className="text-sm text-gray-500">Notes</p>
            <div className="p-3 bg-gray-50 rounded-lg text-gray-700 min-h-[60px]">
              {buyer.notes || "-"}
            </div>

            <p className="text-sm text-gray-500">Tags</p>
            <div className="p-2 bg-gray-50 rounded-lg text-gray-700">
              {buyer.tags?.join(", ") || "-"}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setIsEditing(!isEditing)}
        className="mt-4 px-4 py-2 rounded-xl bg-amber-100 text-black hover:bg-amber-200"
      >
        {isEditing ? "Editing" : "Edit"}
      </button>
    </div>
  );
}
