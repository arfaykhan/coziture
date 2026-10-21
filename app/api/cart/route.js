import {cart} from '@/lib/validation';
import {endpoint,body,reject} from '@/lib/http';
import {catalog,settings} from '@/lib/catalog';
import {shipping} from '@/lib/utils';
export const POST=endpoint(async request=>{
  const requested=cart.parse(await body(request));const {products}=await catalog();const config=await settings();
  const items=requested.map(i=>{const p=products.find(p=>p.id===i.id);if(!p || p.stock<i.quantity) reject('An item is unavailable. Update your bag.',409);return {...p,quantity:i.quantity};});
  const subtotal=items.reduce((s,p)=>s+p.price_cents*p.quantity,0);return {items,subtotal,shipping:shipping(subtotal,config),currency:config.currency};
});
