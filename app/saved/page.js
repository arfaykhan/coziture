import {catalog,settings} from '@/lib/catalog';
import Catalog from '@/components/Catalog';
export default async function Page({searchParams}){const [data,s,initial]=await Promise.all([catalog(),settings(),searchParams]);return <section className="section"><p className="eyebrow">A LITTLE SOMETHING FOR YOUR EVERYDAY</p><h1>Saved favorites</h1><Catalog {...data} currency={s.currency} initial={initial} savedOnly={true}/></section>;}
