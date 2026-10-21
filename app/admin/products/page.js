import {requireUser} from '@/lib/auth';
import {query} from '@/lib/db';
import {settings} from '@/lib/catalog';
import AdminEditor from '@/components/AdminEditor';
export default async function Page(){await requireUser(true);const rows=await query('SELECT * FROM products ORDER BY id DESC');const categories=await query('SELECT * FROM store_categories ORDER BY sort_order,name');const s=await settings();return <><h1>Products</h1><AdminEditor kind="products" rows={rows} categories={categories} currency={s.currency}/></>;}
