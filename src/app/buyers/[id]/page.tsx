import { prisma } from "@/lib/db";
import { createServerSupaBaseClient } from "@/lib/supabase/supabaseServer";
import BuyerWrapper from "@/components/BuyerWrapper";

export default async function getBuyerData({
  params,
}: {
  params: { id: string };
}) {
  try {
    
    const supabase = await createServerSupaBaseClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    
    if (error || !user) {
      return <div>You must be logged in to view this page.</div>;
    }

  const id = (await params).id;
  const buyer = await getBuyer(id);
  if(!buyer)
  {
    return <><div>No Buyer Found</div></>

  }
    
     return <BuyerWrapper initialBuyer={buyer} />
    
  } catch (err) {
    console.log(err);
  }
}


async function getBuyer(id : string)
{
  const buyer = await prisma.buyer.findUnique({
    where: { id: id },
  });

  if (!buyer) {
    return null
  }
  return buyer
}

