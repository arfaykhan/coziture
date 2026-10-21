import {defaults} from './defaults.js';
import {shipping,transitions} from './utils.js';
import {reject} from './http.js';
export async function createOrder(q,user,data) {
  // Serialize a user's checkouts so retries cannot decrement inventory twice.
  await q('SELECT id FROM users WHERE id=$1 FOR UPDATE',[user.id]);
  const [existing]=await q('SELECT id,user_id FROM shop_orders WHERE checkout_key=$1',[data.checkout_key]);
  if(existing) {if(existing.user_id!==user.id) reject('Invalid checkout key.',409);return {id:existing.id};}
  const [payment]=await q('SELECT * FROM store_payments WHERE code=$1 AND active FOR SHARE',[data.payment_method]);
  if(!payment) reject('Choose an available payment method.');
  const settings={...defaults,...Object.fromEntries((await q('SELECT * FROM store_settings')).map(r=>[r.setting_key,r.setting_value]))};
  const items=[];
  for(const item of [...data.items].sort((a,b)=>a.id-b.id)) {
    const [p]=await q('SELECT * FROM products WHERE id=$1 FOR UPDATE',[item.id]);
    if(!p?.active || p.stock<item.quantity) reject('An item is unavailable. Update your bag.',409);
    items.push({...p,quantity:item.quantity});
  }
  const subtotal=items.reduce((sum,p)=>sum+p.price_cents*p.quantity,0),delivery=shipping(subtotal,settings);
  if(!Number.isSafeInteger(subtotal)||subtotal+delivery>2147483647) reject('Order total is too large.');
  const [order]=await q(`INSERT INTO shop_orders(user_id,checkout_key,name,email,address,city,postal,country,total_cents,shipping_cents,currency,payment_method,payment_name,payment_instructions,payment_reference) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15) RETURNING id`,[user.id,data.checkout_key,data.name,data.email,data.address,data.city,data.postal,data.country,subtotal+delivery,delivery,settings.currency,payment.code,payment.name,payment.instructions,data.payment_reference]);
  for(const p of items) {
    await q('INSERT INTO shop_order_items(order_id,product_id,name,price_cents,quantity) VALUES ($1,$2,$3,$4,$5)',[order.id,p.id,p.name,p.price_cents,p.quantity]);
    await q('UPDATE products SET stock=stock-$1 WHERE id=$2',[p.quantity,p.id]);
  }
  return order;
}
export async function updateOrder(q,id,data) {
  const [order]=await q('SELECT * FROM shop_orders WHERE id=$1 FOR UPDATE',[id]);
  if(!order) reject('Order not found.',404);
  if(!transitions[order.status].includes(data.status)) reject('That fulfillment transition is not allowed.',409);
  if(data.status==='cancelled' && order.status!=='cancelled') for(const item of await q('SELECT * FROM shop_order_items WHERE order_id=$1 ORDER BY product_id',[id])) await q('UPDATE products SET stock=stock+$1 WHERE id=$2',[item.quantity,item.product_id]);
  await q('UPDATE shop_orders SET status=$1,payment_status=$2,tracking_number=$3,admin_notes=$4 WHERE id=$5',[data.status,data.payment_status,data.tracking_number,data.admin_notes,id]);
  return {ok:true};
}
