import {notFound} from 'next/navigation';
import {catalog,settings} from '@/lib/catalog';
import ProductDetail from '@/components/ProductDetail';
export default async function Page({params}){const {id}=await params;const [{products},s]=await Promise.all([catalog(),settings()]);const p=products.find(p=>String(p.id)===id);if(!p)notFound();return <section className="section"><ProductDetail product={p} currency={s.currency}/></section>;}
