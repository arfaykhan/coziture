import {catalog,settings} from '@/lib/catalog';
import Cart from '@/components/Cart';
export default async function Page(){const [{products},s]=await Promise.all([catalog(),settings()]);return <section className="section"><h1>Your bag</h1><Cart products={products} settings={s}/></section>;}
