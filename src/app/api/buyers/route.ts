
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { BuyerLeadType, buyerSchemaWithRefinements } from "@/lib/zod/buyer";
import { createServerSupaBaseClient } from "@/lib/supabase/supabaseServer";



// type City = BuyerLeadType["city"] | " ";
// type PropertyType = BuyerLeadType["propertyType"];
// // type Status = BuyerLeadType["status"];
// // type Timeline = BuyerLeadType["timeline"];






export async function POST(req: NextRequest) {
  const supabase = await createServerSupaBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  const data = await req.json();
  console.log("Data",data)
  const validData = await buyerSchemaWithRefinements.safeParseAsync(data);
  if (!validData.success) {
    console.log(validData.error);
    return NextResponse.json({ error: validData.error }, { status: 400 });
  }
  const existingLead = await prisma.buyer.findFirst({
    where: {
      OR: [
        { email: validData.data.email ? validData.data.email : undefined },
        { phone: validData.data.phone }
      ]
    }
  })

  if (existingLead) {
    return NextResponse.json({ error: "A lead with the same email or phone number already exists." }, { status: 400 });
  }
  try {

    const buyer = await prisma.$transaction(async (tx) => {
      const createdLead = await tx.buyer.create({
        data: {
          ...validData.data,
          ownerId: user.id,
        }
      });

      await tx.buyerHistory.create({
        data: {
          buyerId: createdLead.id,
          changedBy: createdLead.ownerId,
          changedAt: new Date(),
          diff: createdLead,
        }
      })
      return createdLead;
    });
    return NextResponse.json({ message: "Buyer lead created successfully" }, { status: 201 });
  }
  catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }


}


export async function GET(req: NextRequest) {

  const supabase = await createServerSupaBaseClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pagesize") || 10);
  const query = searchParams.get("query") || "";
  const exportAll = searchParams.get("all") === "true";

  //TO-DO Infer type from zod and apply here

  const cities: any = searchParams.getAll("cities[]");
  const propertyTypes: any = searchParams.getAll("propertyTypes[]");


  const buyers = await prisma.buyer.findMany({
    where: {
      AND: [{
        OR: [
          { fullName: { contains: query, mode: 'insensitive' } },
          { email: { contains: query, mode: 'insensitive' } },
          { phone: { contains: query, mode: 'insensitive' } },
        ]
      },
      cities.length > 0 ? { city: { in: cities } } : {},
      propertyTypes.length > 0 ? { propertyType: { in: propertyTypes } } : {}
      ]
    },
    skip: exportAll? undefined : (page - 1) * pageSize,
    take: exportAll? undefined : pageSize,
    orderBy: { updatedAt: 'desc' }
  });

  const total = await prisma.buyer.count({
    where: {
      AND: [
        {
          OR: [
            { fullName: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
          ],
        },
        cities.length ? { city: { in: cities } } : {},
        propertyTypes.length ? { propertyType: { in: propertyTypes } } : {},
      ],
    },
  });

  return NextResponse.json({
    buyers,
    totalPages: Math.ceil(total / pageSize)
  })

}

//Implement caching later
//   import NodeCache from "node-cache";

// const cache = new NodeCache({ stdTTL: 60 }); //alive for 60 seconds

// async function getTotalBuyers() {
//   let total = cache.get<number>("buyerCount");
//   if (total === undefined) {
//     total = await prisma.buyer.count();
//     cache.set("buyerCount", total);
//   }
//   return total;
// }