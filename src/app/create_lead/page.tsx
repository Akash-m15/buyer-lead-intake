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

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        budgetMin: form.budgetMin ? Number(form.budgetMin) : null,
        budgetMax: form.budgetMax ? Number(form.budgetMax) : null,
      };

      const res = await axios.post("/api/buyers", payload);

      if (res.status === 201) {
        setSuccess("Buyer lead created successfully!");
        setForm({
          fullName: "",
          email: "",
          phone: "",
          city: "City",
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
    <div className="max-w-xl mx-auto p-6 border rounded-lg shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-700">
       Create a Buyer
      </h2>
    

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-600 mb-4">{success}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold mb-1">Email Address</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-semibold mb-1">City</label>
          <select
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Chandigarh">Chandigarh</option>
            <option value="Mohali">Mohali</option>
            <option value="Zirakpur">Zirakpur</option>
            <option value="Panchkula">Panchkula</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Property Type */}
        <div>
          <label className="block text-sm font-semibold mb-1">Property Type</label>
          <select
            name="propertyType"
            value={form.propertyType}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Apartment">Apartment</option>
            <option value="Villa">Villa</option>
            <option value="Plot">Plot</option>
            <option value="Office">Office</option>
            <option value="Retail">Retail</option>
          </select>
        </div>

        {/* BHK */}
        <div>
          <label className="block text-sm font-semibold mb-1">BHK</label>
          <select
            name="bhk"
            value={form.bhk}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="">--</option>
            <option value="Studio">Studio</option>
            <option value="One">1 BHK</option>
            <option value="Two">2 BHK</option>
            <option value="Three">3 BHK</option>
            <option value="Four">4 BHK</option>
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold mb-1">Purpose</label>
          <select
            name="purpose"
            value={form.purpose}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
          </select>
        </div>

        {/* Budget */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Budget Min</label>
            <input
              type="number"
              name="budgetMin"
              value={form.budgetMin}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-1">Budget Max</label>
            <input
              type="number"
              name="budgetMax"
              value={form.budgetMax}
              onChange={handleChange}
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Timeline */}
        <div>
          <label className="block text-sm font-semibold mb-1">Timeline to Purchase</label>
          <select
            name="timeline"
            value={form.timeline}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="ZERO_TO_THREE">0-3 months</option>
            <option value="THREE_TO_SIX">3-6 months</option>
            <option value="MORE_THAN_SIX">More than 6 months</option>
            <option value="EXPLORING">Exploring</option>
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="block text-sm font-semibold mb-1">Source</label>
          <select
            name="source"
            value={form.source}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="Website">Website</option>
            <option value="Referral">Referral</option>
            <option value="WalkIn">Walk In</option>
            <option value="Call">Call</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-semibold mb-1">Additional Comments / Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded w-full mt-4"
        >
          Submit 
        </button>
      </form>
    </div>
  );
}
