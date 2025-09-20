/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/db"
import { createServerSupaBaseClient } from "@/lib/supabase/supabaseServer"
import { JsonValue } from "@prisma/client/runtime/library"
import { NextRequest, NextResponse } from "next/server"

type BuyerHistoryEntry = {
  changedBy: string
  changedAt: Date
  diff: JsonValue
}



export async function GET(req: NextRequest) {
  const supabase = await createServerSupaBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

if (error || !user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
console.log("Inside endpoint get")
  const { searchParams } = new URL(req.url)
  const buyerId = searchParams.get("id")
  if (!buyerId) return NextResponse.json({ error: "Buyer ID required" }, { status: 400 })

  const buyer = await prisma.buyer.findUnique({ where: { id: buyerId } })
  if (!buyer) return NextResponse.json({ error: "Buyer not found" }, { status: 404 })

  // Only owner can view history
  if (buyer.ownerId !== user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const history : BuyerHistoryEntry[] = await prisma.buyerHistory.findMany({
    where: {  buyerId },
    orderBy: { changedAt: "desc" },
    take: 5
  })
  history.pop();
  // console.log(history);
  // Map diff to readable format: field → old → new
  const formattedHistory = history.map((h, index) => {
    if (!h.diff || typeof h.diff !== "object" || Array.isArray(h.diff)) return null;
   

    const changes = Object.entries(h.diff).map(([field, value]: [string, any]) => ({
      field,
      old: value.old,
      new: value.new
    }))

    return {
      changedBy: h.changedBy,
      changedAt: h.changedAt,
      changes
    }
  }).filter(Boolean)

  if (!formattedHistory.length) {
    return NextResponse.json({ success: true, data: [] })
  }

  return NextResponse.json({ success: true, data: formattedHistory })
}


export const config = {
  runtime: "nodejs",
};