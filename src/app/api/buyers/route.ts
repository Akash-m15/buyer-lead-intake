import axios from "axios";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buyerSchemaWithRefinements } from "@/lib/validation/buyer";

export async function POST(req: NextRequest) {

  const { data } = await req.json();
  const validData = await buyerSchemaWithRefinements.safeParseAsync(data);
  if (!validData.success) {
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
          ownerId: "1", // Temporary until auth is implemented,
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


export async function GET(req: NextRequest) 
{
  const {searchParams} = new URL(req.url);
  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pagesize") || 10);

  const buyers = await prisma.buyer.findMany({
    skip : (page - 1) * pageSize,
    take : pageSize,
    orderBy : { updatedAt : 'desc' }
  });

  const total = await prisma.buyer.count();

  return NextResponse.json({
    buyers,
    totalPages : Math.ceil(total / pageSize)
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