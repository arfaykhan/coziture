'use client';
import {useState} from 'react';
import ProductCard from './ProductCard';
import {useStore} from './StoreProvider';
export default function Catalog({products,categories,currency,initial={},savedOnly=false}) {
 const [q,setQ]=useState(initial.q||''),[category,setCategory]=useState(initial.category||''),[sort,setSort]=useState(initial.sort||'new');const {saved,ready}=useStore();
 const list=products.filter(p=>(!savedOnly||saved.includes(p.id))&&(!category||p.category===category)&&`${p.name} ${p.description}`.toLowerCase().includes(q.toLowerCase())).sort((a,b)=>sort==='price_asc'?a.price_cents-b.price_cents:sort==='price_desc'?b.price_cents-a.price_cents:sort==='name'?a.name.localeCompare(b.name):b.id-a.id);
 return <><div className="filters"><label>Search<input value={q} onChange={e=>setQ(e.target.value)} placeholder="Find your next favorite…"/></label><label>Category<select value={category} onChange={e=>setCategory(e.target.value)}><option value="">All categories</option>{categories.map(c=><option key={c.id}>{c.name}</option>)}</select></label><label>Sort by<select value={sort} onChange={e=>setSort(e.target.value)}><option value="new">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option><option value="name">Name</option></select></label></div><p className="muted">{savedOnly&&!ready?'Loading saved items…':`${list.length} thoughtfully chosen pieces`}</p><div className="product-grid">{list.map(p=><ProductCard key={p.id} product={p} currency={currency}/>)}</div>{!list.length&&<p className="empty">{savedOnly?'Save something you love using the heart on a product.':'No products match your search.'}</p>}</>;
}
