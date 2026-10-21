import {z} from 'zod';
import {requireUser} from './auth.js';
import {query,transaction} from './db.js';
import {endpoint,body,reject} from './http.js';
import {id,product,category,payment,image} from './validation.js';
import {defaults} from './defaults.js';
export function adminEndpoint(kind) {return endpoint(async request=>{
  const user=await requireUser(true), data=await body(request);
  const key=data.id===undefined ? null : id.parse(data.id);
  if(kind==='products') {
    if(request.method==='DELETE') {await query('DELETE FROM products WHERE id=$1',[id.parse(key)]);return {ok:true};}
    const p=product.parse(data), values=Object.values(p);
    if(key) await query('UPDATE products SET name=$1,description=$2,category=$3,price_cents=$4,image=$5,stock=$6,active=$7,featured=$8 WHERE id=$9',[...values,key]);
    else await query('INSERT INTO products(name,description,category,price_cents,image,stock,active,featured) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)',values);
  } else if(kind==='categories') {
    if(request.method==='DELETE') {await query('DELETE FROM store_categories WHERE id=$1',[id.parse(key)]);return {ok:true};}
    const c=category.parse(data);
    if(key) await query('UPDATE store_categories SET name=$1,icon=$2,sort_order=$3 WHERE id=$4',[c.name,c.icon,c.sort_order,key]);
    else await query('INSERT INTO store_categories(name,icon,sort_order) VALUES ($1,$2,$3)',[c.name,c.icon,c.sort_order]);
  } else if(kind==='payments') {
    id.parse(key); const p=payment.parse(data);
    await transaction(async q=>{
      const methods=await q('SELECT * FROM store_payments ORDER BY id FOR UPDATE');
      const method=methods.find(m=>m.id===key);if(!method) reject('Payment method not found.',404);
      if(!p.active && !methods.some(m=>m.id!==key&&m.active)) reject('Keep at least one payment method enabled.');
      if(p.active && method.code!=='cash_on_delivery' && !p.instructions) reject('Add payment instructions before enabling this method.');
      await q('UPDATE store_payments SET name=$1,instructions=$2,active=$3 WHERE id=$4',[p.name,p.instructions,p.active,key]);
    });
  } else if(kind==='customers') {
    id.parse(key); if(key===user.id) reject('You cannot change your own administrator role.');
    await query('UPDATE users SET role=$1 WHERE id=$2',[z.enum(['user','admin']).parse(data.role),key]);
  } else if(kind==='settings') {
    const parsed={};
    for(const key of Object.keys(defaults)) {
      if(!(key in data)) continue;
      let value=z.string().trim().max(5000).parse(data[key]);
      if(['brand','hero_title'].includes(key)) value=z.string().min(1).max(100).parse(value);
      if(key==='currency') value=z.enum(['USD','PKR','EUR','GBP','AED']).parse(value);
      if(key.endsWith('_cents')) value=String(z.coerce.number().int().min(0).max(99999999).parse(value));
      if(key==='hero_image') value=image.parse(value);
      if(key==='support_email' && value) value=z.email().parse(value);
      parsed[key]=value;
    }
    await transaction(async q=>{for(const [k,v] of Object.entries(parsed)) await q('INSERT INTO store_settings VALUES ($1,$2) ON CONFLICT(setting_key) DO UPDATE SET setting_value=EXCLUDED.setting_value',[k,v]);});
  }
  return {ok:true};
});}
