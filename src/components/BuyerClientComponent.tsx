"use client"

import axios from "axios";
import { useState } from "react";

export default function BuyerClientComponent({ buyer }: any) {

  const [isEditing, setIsEditing] = useState(false);

 const handleSubmit = async( e: React.FormEvent) =>
 {
  e.preventDefault();
  // console.log("Form Submitted")
  const formData = new FormData(e.currentTarget as HTMLFormElement);
  const rawData = Object.fromEntries(formData.entries());
  // console.log(rawData);
  try{

    const res = await axios.put(`../api/buyer?id=${buyer.id}`,rawData);
    console.log(res.data);
  }catch(err)
  {
    console.log(err)
  }
  
 }

  return (
    <div>
      {isEditing ? (<form onSubmit={handleSubmit}>
  
  <input type="hidden" name="updatedAt" value={buyer.updatedAt} />

  
  <label>
    Full Name
    <input
      type="text"
      name="fullName"
      defaultValue={buyer.fullName}
      required
    />
  </label>


  <label>
    Email
    <input
      type="email"
      name="email"
      defaultValue={buyer.email ?? ""}
    />
  </label>

 
  <label>
    Phone
    <input
      type="tel"
      name="phone"
      defaultValue={buyer.phone}
      required
    />
  </label>

  
  <label>
    City
    <select name="city" defaultValue={buyer.city}>
      <option value="Chandigarh">Chandigarh</option>
      <option value="Mohali">Mohali</option>
      <option value="Zirakpur">Zirakpur</option>
      <option value="Panchkula">Panchkula</option>
      <option value="Other">Other</option>
    </select>
  </label>

  
  <label>
    Property Type
    <select name="propertyType" defaultValue={buyer.propertyType}>
      <option value="Apartment">Apartment</option>
      <option value="Villa">Villa</option>
      <option value="Plot">Plot</option>
      <option value="Office">Office</option>
      <option value="Retail">Retail</option>
    </select>
  </label>

  
  <label>
    BHK
    <select name="bhk" defaultValue={buyer.bhk ?? ""}>
      <option value="">--</option>
      <option value="Studio">Studio</option>
      <option value="One">1 BHK</option>
      <option value="Two">2 BHK</option>
      <option value="Three">3 BHK</option>
      <option value="Four">4 BHK</option>
    </select>
  </label>

  {/* Purpose */}
  <label>
    Purpose
    <select name="purpose" defaultValue={buyer.purpose}>
      <option value="Buy">Buy</option>
      <option value="Rent">Rent</option>
    </select>
  </label>

  
  <label>
    Budget Min
    <input
      type="number"
      name="budgetMin"
      defaultValue={buyer.budgetMin ?? ""}
    />
  </label>
  <label>
    Budget Max
    <input
      type="number"
      name="budgetMax"
      defaultValue={buyer.budgetMax ?? ""}
    />
  </label>


  <label>
    Timeline
    <select name="timeline" defaultValue={buyer.timeline}>
      <option value="ZERO_TO_THREE">0–3 months</option>
      <option value="THREE_TO_SIX">3–6 months</option>
      <option value="MORE_THAN_SIX">More than 6 months</option>
      <option value="EXPLORING">Exploring</option>
    </select>
  </label>

  
  <label>
    Source
    <select name="source" defaultValue={buyer.source}>
      <option value="Website">Website</option>
      <option value="Referral">Referral</option>
      <option value="WalkIn">Walk In</option>
      <option value="Call">Call</option>
      <option value="Other">Other</option>
    </select>
  </label>

 
  <label>
    Status
    <select name="status" defaultValue={buyer.status}>
      <option value="New">New</option>
      <option value="Qualified">Qualified</option>
      <option value="Contacted">Contacted</option>
      <option value="Visited">Visited</option>
      <option value="Negotiation">Negotiation</option>
      <option value="Converted">Converted</option>
      <option value="Dropped">Dropped</option>
    </select>
  </label>


  <label>
    Notes
    <textarea name="notes" defaultValue={buyer.notes ?? ""} />
  </label>

  
  <label>
    Tags
    <input
      type="text"
      name="tags"
      defaultValue={buyer.tags?.join(", ") ?? ""}
      placeholder="comma separated"
    />
  </label>

  
  <button type="submit" className="m-2 p-2 border-amber-100 text-blue-400">Save</button>
  <button type="button" onClick={() => setIsEditing(false)}>
    Cancel
  </button>
</form>
) : (
      <div>
      <div>
        <h1>{buyer.fullName}</h1>
        <span>{buyer.status}</span>
        <span>{buyer.ownerId}</span>
      </div>
      <div>
        <span>{buyer.phone}</span>
        <span>{buyer.email}</span>
      </div>
      <div>
        <p>{buyer.city}</p>
        <p>{buyer.budget}</p>
        <p>{buyer.propertyType}</p>
        <p>{buyer.bhk}</p>
        <p>{buyer.timeline}</p>
      </div>
      <div>
        <p>{buyer.source}</p>
        <p>{buyer.tags}</p>
        <p>{buyer.notes}</p>
      </div>
    </div>
      )
    }
    <button onClick={()=>setIsEditing(!isEditing)} className="border bg-amber-100 text-black w-18 p-2 rounded-xl">Edit</button>
    </div>
  );
}
