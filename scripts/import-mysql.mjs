import {loadEnvConfig} from '@next/env';
import pg from 'pg';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
loadEnvConfig(process.cwd());
if(!process.env.DATABASE_URL)throw new Error('Set DATABASE_URL first.');
let input='';for await(const chunk of process.stdin)input+=chunk;
const data=JSON.parse(input.replace(/^\uFEFF/,''));
const columns={users:'id,name,email,password,role,created_at',store_categories:'id,name,icon,sort_order',products:'id,name,description,category,price_cents,image,stock,active,featured,created_at',store_settings:'setting_key,setting_value',store_payments:'id,code,name,instructions,active',shop_orders:'id,user_id,checkout_key,name,email,address,city,postal,country,total_cents,shipping_cents,currency,status,payment_method,payment_name,payment_instructions,payment_status,payment_reference,tracking_number,admin_notes,created_at',shop_order_items:'id,order_id,product_id,name,price_cents,quantity'};
for(const table of Object.keys(columns))if(!Array.isArray(data[table]))throw new Error(`Export is missing ${table}. Run the PHP migrations first.`);
const db=new pg.Client({connectionString:process.env.DATABASE_URL});await db.connect();
try {
 await db.query('BEGIN');await db.query(await readFile(new URL('../db/schema.sql',import.meta.url),'utf8'));
 for(const table of Object.keys(columns))if(Number((await db.query(`SELECT COUNT(*) FROM ${table}`)).rows[0].count))throw new Error('Import requires an empty target database. Use a new Neon branch; do not seed first.');
 for(const [table,names] of Object.entries(columns))for(const row of data[table]){
  const keys=names.split(','), values=keys.map(key=>{
   let value=row[key];
   if(key==='active'||key==='featured')return Boolean(Number(value));
   if(key==='email')return String(value).toLowerCase();
   if(key==='checkout_key'){const hex=createHash('sha256').update(String(value)).digest('hex');return `${hex.slice(0,8)}-${hex.slice(8,12)}-4${hex.slice(13,16)}-8${hex.slice(17,20)}-${hex.slice(20,32)}`;}
   if(key==='created_at')return value?`${value}Z`:new Date().toISOString();
   if(key==='image'||(key==='setting_value'&&row.setting_key==='hero_image'))return String(value).replace(/^assets\/shop\//,'/shop/').replace(/^media\/products\//,'/media/products/');
   if(['payment_instructions','admin_notes','payment_reference','tracking_number'].includes(key))return value||'';
   if(key==='currency')return value||'USD';
   return value;
  });
  await db.query(`INSERT INTO ${table}(${names}) VALUES (${keys.map((_,i)=>`$${i+1}`).join(',')})`,values);
 }
 for(const [table,names] of Object.entries(columns))if(names.startsWith('id,'))await db.query(`SELECT setval(pg_get_serial_sequence('${table}','id'),COALESCE(MAX(id),1),MAX(id) IS NOT NULL) FROM ${table}`);
 await db.query('COMMIT');console.log('Imported store data. Existing bcrypt passwords and order snapshots preserved.');
}catch(error){await db.query('ROLLBACK');throw error;}finally{await db.end();}
