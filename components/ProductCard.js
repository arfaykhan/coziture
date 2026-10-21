'use client';
import Link from 'next/link';
import {useStore} from './StoreProvider';
import {money} from '@/lib/utils';
export default function ProductCard({product:p,currency}) {const {save,saved,add,ready}=useStore();return <article className="product-card"><div className="product-image"><Link href={`/product/${p.id}`}><img src={p.image} alt={p.name} loading="lazy"/></Link><button className="save" disabled={!ready} aria-label={`${saved.includes(p.id)?'Unsave':'Save'} ${p.name}`} aria-pressed={saved.includes(p.id)} onClick={()=>save(p.id)}>{saved.includes(p.id)?'♥':'♡'}</button>{p.featured&&<span className="badge">A favorite</span>}</div><p className="eyebrow">{p.category}</p><Link href={`/product/${p.id}`}><h3>{p.name}</h3></Link><div className="row"><span>{money(p.price_cents,currency)}</span><button className="text-button" disabled={!ready||!p.stock} onClick={()=>add(p)}>{p.stock?'Add to bag +':'Sold out'}</button></div></article>;}
