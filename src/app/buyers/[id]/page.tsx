import axios from "axios";
import BuyerClientComponent from "@/components/BuyerClientComponent";
import BuyerHistory from "@/components/BuyerHistory"

export default async function getBuyerData({params} : {params: {id: string}})
{
  const id = (await params).id;
  const res = await axios.get(`${process.env.NEXT_BASE_URL}/api/buyer/?id=${id}`);
  if(res.status !== 200)
  {
    return <div>Failed to load buyer data</div>
  }
  const buyer = res.data.data;

  const resHistory = await axios.get(`${process.env.NEXT_BASE_URL}/api/buyer/history/?id=${id}`);
  if(resHistory.status !== 200)
  {
    return <div>Failed to load buyer history</div>
  }
  const history = resHistory.data.data;


  return 
  <div>
    <BuyerClientComponent buyer={buyer} />
    <BuyerHistory history={history} />
    </div>
}