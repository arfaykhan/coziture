import {query} from './db.js';
import {defaults, products, categories} from './defaults.js';
export async function settings() { return process.env.DATABASE_URL ? {...defaults,...Object.fromEntries((await query('SELECT * FROM store_settings')).map(r=>[r.setting_key,r.setting_value]))} : defaults; }
export async function catalog() {
  if (!process.env.DATABASE_URL) return {products,categories};
  const [p,c] = await Promise.all([query('SELECT * FROM products WHERE active ORDER BY id DESC'),query('SELECT * FROM store_categories ORDER BY sort_order,name')]);
  return {products:p,categories:c};
}
