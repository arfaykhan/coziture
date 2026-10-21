import {settings} from '@/lib/catalog';
import {money} from '@/lib/utils';
export default async function Page(){const s=await settings();return <section className="section prose"><h1>{s.about_title}</h1><p>{s.about_text}</p></section>;}