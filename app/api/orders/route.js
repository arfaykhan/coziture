import {z} from 'zod';
import {requireUser} from '@/lib/auth';
import {query,transaction} from '@/lib/db';
import {checkout,id} from '@/lib/validation';
import {endpoint,body} from '@/lib/http';
import {createOrder,updateOrder} from '@/lib/orders';
export const GET=endpoint(async()=>{const user=await requireUser();return query('SELECT id,total_cents,currency,status,created_at FROM shop_orders WHERE user_id=$1 ORDER BY id DESC',[user.id]);});
export const POST=endpoint(async request=>{const user=await requireUser();const data=checkout.parse(await body(request));return transaction(q=>createOrder(q,user,data));});
export const PATCH=endpoint(async request=>{
  await requireUser(true);
  const data=z.object({id,status:z.enum(['pending','processing','shipped','completed','cancelled']),payment_status:z.enum(['unpaid','paid','refunded']),tracking_number:z.string().max(160),admin_notes:z.string().max(3000)}).parse(await body(request));
  return transaction(q=>updateOrder(q,data.id,data));
});
