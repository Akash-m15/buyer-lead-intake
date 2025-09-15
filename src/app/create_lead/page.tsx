"use client";

import { useState } from "react";
import Link from "next/link";
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
    timeline: "ZERO\_TO\_THREE",
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
          city: "Other",
          propertyType: "Apartment",
          bhk: "",
          purpose: "Buy",
          budgetMin: "",
          budgetMax: "",
          timeline: "ZERO\_TO\_THREE",
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

  const inputClass =
    "w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-700 text-base focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all";

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-lg p-10 md:p-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center text-black">
          Create Buyer Lead
        </h2>
        <Link href="/buyers">Go to Buyers</Link>
        {error && (
          <p className="text-red-700 bg-red-100 p-3 rounded mb-4">{error}</p>
        )}
        {success && (
          <p className="text-green-800 bg-green-100 p-3 rounded mb-4">
            {success}
            
          </p>
          
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold mb-1">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="Enter full name"
              required
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@example.com"
              className={inputClass}
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-semibold mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="+1234567890"
              required
              className={inputClass}
            />
          </div>

          {/* City & Property Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-semibold mb-1">
                City
              </label>
              <select
                id="city"
                name="city"
                value={form.city}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Chandigarh">Chandigarh</option>
                <option value="Mohali">Mohali</option>
                <option value="Zirakpur">Zirakpur</option>
                <option value="Panchkula">Panchkula</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="propertyType" className="block text-sm font-semibold mb-1">
                Property Type
              </label>
              <select
                id="propertyType"
                name="propertyType"
                value={form.propertyType}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Apartment">Apartment</option>
                <option value="Villa">Villa</option>
                <option value="Plot">Plot</option>
                <option value="Office">Office</option>
                <option value="Retail">Retail</option>
              </select>
            </div>
          </div>

          {/* BHK & Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="bhk" className="block text-sm font-semibold mb-1">
                BHK
              </label>
              <select
                id="bhk"
                name="bhk"
                value={form.bhk}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">--</option>
                <option value="Studio">Studio</option>
                <option value="One">1 BHK</option>
                <option value="Two">2 BHK</option>
                <option value="Three">3 BHK</option>
                <option value="Four">4 BHK</option>
              </select>
            </div>

            <div>
              <label htmlFor="purpose" className="block text-sm font-semibold mb-1">
                Purpose
              </label>
              <select
                id="purpose"
                name="purpose"
                value={form.purpose}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="Buy">Buy</option>
                <option value="Rent">Rent</option>
              </select>
            </div>
          </div>

          {/* Budget */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="budgetMin" className="block text-sm font-semibold mb-1">
                Budget Min
              </label>
              <input
                id="budgetMin"
                type="number"
                name="budgetMin"
                value={form.budgetMin}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="budgetMax" className="block text-sm font-semibold mb-1">
                Budget Max
              </label>
              <input
                id="budgetMax"
                type="number"
                name="budgetMax"
                value={form.budgetMax}
                onChange={handleChange}
                placeholder="100000"
                className={inputClass}
              />
            </div>
          </div>

          {/* Timeline */}
          <div>
            <label htmlFor="timeline" className="block text-sm font-semibold mb-1">
              Timeline
            </label>
            <select
              id="timeline"
              name="timeline"
              value={form.timeline}
              onChange={handleChange}
              className={inputClass}
            >
              <option value="ZERO\_TO\_THREE">0-3 months</option>
              <option value="THREE\_TO\_SIX">3-6 months</option>
              <option value="MORE\_THAN\_SIX">More than 6 months</option>
              <option value="EXPLORING">Exploring</option>
            </select>
          </div>

          {/* Source */}
          <div>
            <label htmlFor="source" className="block text-sm font-semibold mb-1">
              Source
            </label>
            <select
              id="source"
              name="source"
              value={form.source}
              onChange={handleChange}
              className={inputClass}
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
            <label htmlFor="notes" className="block text-sm font-semibold mb-1">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add any additional information here"
              className={inputClass}
              rows={4}
            />
          </div>

          {/* Tags */}
          <div>
            <label htmlFor="tags" className="block text-sm font-semibold mb-1">
              Tags (comma separated)
            </label>
            <input
              id="tags"
              type="text"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g., urgent, investment"
              className={inputClass}
            />
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-72 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-xl mt-4 transition-all text-lg focus:outline-none focus:ring-2 focus:ring-yellow-600"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
