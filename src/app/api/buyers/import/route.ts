/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { parse } from "csv-parse/sync";
import { createServerSupaBaseClient } from "@/lib/supabase/supabaseServer";

const VALID_CITIES = ["Chandigarh", "Mohali", "Zirakpur", "Panchkula", "Other"];
const VALID_PROPERTY_TYPES = ["Apartment", "Villa", "Plot", "Office", "Retail"];
const VALID_PURPOSES = ["Buy", "Rent"];
const VALID_TIMELINES = ["ZERO_TO_THREE", "THREE_TO_SIX", "MORE_THAN_SIX", "EXPLORING"];
const VALID_SOURCES = ["Website", "Referral", "WalkIn", "Call", "Other"];
const VALID_STATUS = ["New", "Qualified", "Contacted", "Visited", "Negotiation", "Converted", "Dropped"];
const VALID_BHK = ["One", "Two", "Three", "Four", "Studio"]


function getTimeline(timeLine: string) {
  switch (timeLine) {
    case "0-3m": return "ZERO_TO_THREE"
    case "3-6m": return "THREE_TO_SIX"
    case ">6m": return "MORE_THAN_SIX"
    case "Exploring": return "EXPLORING"
  }
}

export async function POST(req: Request) {

  const supabase = await createServerSupaBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.text();
    console.log(body);
    const records = parse(body, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
    });

    if (records.length > 200) {
      return NextResponse.json({ error: "Max 200 rows allowed" }, { status: 400 });
    }

    const errors: { row: number; message: string }[] = [];
    const validRows: any[] = [];

    records.forEach((row: any, idx: number) => {
      const rowNum = idx + 1; // +1 since we have to start after header col
      let rowErrors: string[] = [];
      row.timeline = getTimeline(row.timeline)

      // console.log(row.timeline)

      if (!row.fullName) rowErrors.push("Full Name is required");

      if (!row.phone) rowErrors.push("Phone is required");
      
      if (row.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(row.email)) {
        rowErrors.push(`Invalid email: ${row.email}`);
      }
      
      if (!VALID_CITIES.includes(row.city)) rowErrors.push(`Invalid city: ${row.city}`);
      
      if (!VALID_PROPERTY_TYPES.includes(row.propertyType))
        rowErrors.push(`Invalid propertyType: ${row.propertyType}`);
      
      if (["Apartment", "Studio"].includes(row.propertyType) && !VALID_BHK.includes(row.bhk)) rowErrors.push(`Bhk is required if propertyType ∈ {Apartment, Villa},${row.bhk}`)
      
        if (!VALID_PURPOSES.includes(row.purpose)) rowErrors.push(`Invalid purpose: ${row.purpose}`);
      
        if (row.budgetMin && isNaN(Number(row.budgetMin))) rowErrors.push("budgetMin must be a number");
      
        if (row.budgetMax && isNaN(Number(row.budgetMax)) && (Number(row.budgetMax) < Number(row.budgetMin))) rowErrors.push("budgetMax must be a number and greater than budgetMin");
     
        if (!VALID_TIMELINES.includes(row.timeline)) rowErrors.push(`Invalid timeline: ${row.timeline}`);
     
        if (!VALID_SOURCES.includes(row.source)) rowErrors.push(`Invalid source: ${row.source}`);
     
        if (!VALID_STATUS.includes(row.status)) rowErrors.push(`Invalid status: ${row.status}`);

     
        if (rowErrors.length > 0) {
        errors.push({ row: rowNum, message: rowErrors.join(", ") });
      } else {
        validRows.push({
          fullName: row.fullName,
          email: row.email || null,
          phone: row.phone,
          city: row.city,
          propertyType: row.propertyType,
          bhk: row.bhk || null,
          purpose: row.purpose,
          budgetMin: row.budgetMin ? Number(row.budgetMin) : null,
          budgetMax: row.budgetMax ? Number(row.budgetMax) : null,
          timeline: row.timeline,
          source: row.source,
          notes: row.notes || null,
          tags: row.tags ? row.tags.split(",").map((t: string) => t.trim()).filter(Boolean) : [],
          status: row.status,
          ownerId: user.id
        });
      }
    });

    // Insert only valid rows in a transaction
    if (validRows.length > 0) {
      await prisma.$transaction(
        validRows.map((row) => prisma.buyer.create({ data: row }))
      );
    }
    // console.log(validRows)
    return NextResponse.json({ inserted: validRows.length, errors });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Invalid CSV" }, { status: 400 });
  }
}



export const config = {
  runtime: "nodejs",
};