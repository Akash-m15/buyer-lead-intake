import { prisma } from "@/lib/db";
import { createServerSupaBaseClient } from "@/lib/supabase/supabaseServer";
import { getDiffs, normalizeFormData } from "@/lib/util";
import { buyerSchemaWithRefinements } from "@/lib/zod/buyer";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
  console.log("REaching backend api endpoint")

  const supabase = await createServerSupaBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser();

  // console.log("User", user)

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // console.log("After auth check")

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    console.log(id);
    const buyer = await prisma.buyer.findUnique({
      where: {
        id: id
      }
    })

    if (!buyer) {
      return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: buyer
    });
  } catch (err) {
    // console.log(err)
    return NextResponse.json({ error: "Internal Server Error -> "+err }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {

  const supabase = await createServerSupaBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rawData = await req.json();
  const { searchParams } = new URL(req.url);
  const buyer_id = searchParams.get('id');

  // console.log("rawData", rawData)

  if (!buyer_id) {
    return NextResponse.json({ message: "Need Proper Id" });
  }
  const buyer = await prisma.buyer.findUnique({ where: { id: buyer_id } });
  if (!buyer) {
    return NextResponse.json({ error: "Buyer not found" }, { status: 404 });
  }

  if (buyer.ownerId !== user.id) {
    return new Response(
      JSON.stringify({ error: "You are not allowed to edit this record" }),
      { status: 403 }
    )
  }
  // console.log(new Date(rawData.updatedAt).getTime(), buyer.updatedAt.getTime())

  if (new Date(rawData.updatedAt).getTime() !== buyer.updatedAt.getTime()) {
    return NextResponse.json(
      { error: "Record changed, please refresh" },
      { status: 409 }
    );
  }

  // console.log("Reached before Validation")
  const normalizedData = normalizeFormData(rawData);
  console.log("Normalized Data", normalizedData,)
  console.log("OLd data in DB", buyer)
  const mergedData = { ...buyer, ...normalizedData };

  // console.log("MergedData",mergedData)

  const validData = await buyerSchemaWithRefinements.safeParseAsync(mergedData);
  // console.log("Valid Data", validData)

  if (!validData.success) {
    return NextResponse.json({ message: validData.error }, { status: 400 })
  }

  // console.log("Before getDiffs")
  const { changes, diff } = getDiffs(buyer, validData.data);

  // console.log(changes);

  if (Object.keys(diff).length === 0) {
    return NextResponse.json({ data: buyer, message: "No Changes are needed to be made" })
  }

  // console.log("Before transaction")
  
  const [updatedBuyer] = await prisma.$transaction([
    prisma.buyer.update({
      where: { id: buyer.id },
      data: changes,
    }),
    prisma.buyerHistory.create({
      data: {
        buyerId: buyer.id,
        changedBy: buyer.ownerId,
        diff: diff,
      },
    }),
  ]);

  // console.log("Updated Data", updatedBuyer);
  
  return NextResponse.json(updatedBuyer);

}



export const config = {
  runtime: "nodejs",
};