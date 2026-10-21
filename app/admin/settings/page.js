import {requireUser} from '@/lib/auth';
import {query} from '@/lib/db';
import {settings} from '@/lib/catalog';
import AdminEditor from '@/components/AdminEditor';
export default async function Page(){await requireUser(true);const rows=await settings();const categories=await query('SELECT * FROM store_categories ORDER BY sort_order,name');const s=await settings();return <><h1>Settings</h1><AdminEditor kind="settings" rows={rows} categories={categories} currency={s.currency}/></>;}
