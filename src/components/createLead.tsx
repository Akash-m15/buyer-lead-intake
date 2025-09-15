"use client";

import { useState } from "react";
import axios from "axios";

export default function CreateLead() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "Other",
    propertyType: "Apartment",
    bhk: "",
    purpose: "Buy",
    budgetMin: "",
    budgetMax: "",
    timeline: "ZERO_TO_THREE",
    source: "Website",
    status: "New",
    notes: "",
    tags: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        tags: form.tags.split(",").map(tag => tag.trim()).filter(Boolean), // convert comma separated tags
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
      };

      const res = await axios.post("/api/buyer", payload);

      if (res.status === 201) {
        setSuccess("Buyer lead created successfully!");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          city: "Other",
          propertyType: "Apartment",
          bhk: "",
          purpose: "Buy",
          budgetMin: "",
          budgetMax: "",
          timeline: "ZERO_TO_THREE",
          source: "Website",
          status: "New",
          notes: "",
          tags: "",
        });
      }
    } catch (err: any) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-md shadow-md">
      <h2 className="text-xl font-bold mb-4">Create Buyer Lead</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}
      {success && <p className="text-green-500 mb-2">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name" required className="w-full border p-2 rounded" />
        <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border p-2 rounded" />
        <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" required className="w-full border p-2 rounded" />
        <select name="city" value={form.city} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Chandigarh">Chandigarh</option>
          <option value="Mohali">Mohali</option>
          <option value="Zirakpur">Zirakpur</option>
          <option value="Panchkula">Panchkula</option>
          <option value="Other">Other</option>
        </select>
        <select name="propertyType" value={form.propertyType} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Plot">Plot</option>
          <option value="Office">Office</option>
          <option value="Retail">Retail</option>
        </select>
        <select name="bhk" value={form.bhk} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="">--</option>
          <option value="Studio">Studio</option>
          <option value="One">1 BHK</option>
          <option value="Two">2 BHK</option>
          <option value="Three">3 BHK</option>
          <option value="Four">4 BHK</option>
        </select>
        <select name="purpose" value={form.purpose} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Buy">Buy</option>
          <option value="Rent">Rent</option>
        </select>
        <input type="number" name="budgetMin" value={form.budgetMin} onChange={handleChange} placeholder="Budget Min" className="w-full border p-2 rounded" />
        <input type="number" name="budgetMax" value={form.budgetMax} onChange={handleChange} placeholder="Budget Max" className="w-full border p-2 rounded" />
        <select name="timeline" value={form.timeline} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="ZERO_TO_THREE">0-3 months</option>
          <option value="THREE_TO_SIX">3-6 months</option>
          <option value="MORE_THAN_SIX">More than 6 months</option>
          <option value="EXPLORING">Exploring</option>
        </select>
        <select name="source" value={form.source} onChange={handleChange} className="w-full border p-2 rounded">
          <option value="Website">Website</option>
          <option value="Referral">Referral</option>
          <option value="WalkIn">Walk In</option>
          <option value="Call">Call</option>
          <option value="Other">Other</option>
        </select>
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="w-full border p-2 rounded" />
        <input type="text" name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma separated)" className="w-full border p-2 rounded" />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded mt-2">Create Lead</button>
      </form>
    </div>
  );
}
