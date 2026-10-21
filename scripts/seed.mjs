import nextEnv from '@next/env';
const {loadEnvConfig} = nextEnv;
import pg from 'pg';
import bcrypt from 'bcryptjs';
import {readFile} from 'node:fs/promises';
import {defaults,products,categories} from '../lib/defaults.js';
loadEnvConfig(process.cwd());
if(!process.env.DATABASE_URL) throw new Error('Set DATABASE_URL in .env.local first.');
const db=new pg.Client({connectionString:process.env.DATABASE_URL});
await db.connect();
try {
  await db.query('BEGIN');
  await db.query(await readFile(new URL('../db/schema.sql',import.meta.url),'utf8'));
  for(const c of categories) await db.query('INSERT INTO store_categories(name,icon,sort_order) VALUES ($1,$2,$3) ON CONFLICT(name) DO NOTHING',[c.name,c.icon,c.sort_order]);
  for(const [k,v] of Object.entries(defaults)) await db.query('INSERT INTO store_settings VALUES ($1,$2) ON CONFLICT DO NOTHING',[k,v]);
  for(const [code,name,instructions,active] of [['cash_on_delivery','Cash on delivery','Pay the full order total when your package arrives.',true],['bank_transfer','Bank transfer','',false],['mobile_wallet','Mobile wallet','',false]]) await db.query('INSERT INTO store_payments(code,name,instructions,active) VALUES ($1,$2,$3,$4) ON CONFLICT(code) DO NOTHING',[code,name,instructions,active]);
  if((await db.query('SELECT COUNT(*) FROM products')).rows[0].count==='0') for(const p of products) await db.query('INSERT INTO products(name,description,category,price_cents,image,stock,featured) VALUES ($1,$2,$3,$4,$5,$6,$7)',[p.name,p.description,p.category,p.price_cents,p.image,p.stock,p.featured]);
  if(process.env.ADMIN_EMAIL || process.env.ADMIN_PASSWORD) {
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.ADMIN_EMAIL||'') || (process.env.ADMIN_PASSWORD||'').length<12 || Buffer.byteLength(process.env.ADMIN_PASSWORD||'')>72) throw new Error('Supply a valid ADMIN_EMAIL and a 12–72 byte ADMIN_PASSWORD.');
    await db.query("INSERT INTO users(name,email,password,role) VALUES ('Store administrator',$1,$2,'admin') ON CONFLICT(email) DO NOTHING",[process.env.ADMIN_EMAIL.toLowerCase(),await bcrypt.hash(process.env.ADMIN_PASSWORD,12)]);
  }
  await db.query('COMMIT'); console.log('Schema and sample catalog ready. Existing records preserved.');
} catch(error) {await db.query('ROLLBACK');throw error;} finally {await db.end();}
