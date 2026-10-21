import {settings} from '@/lib/catalog';
import {money} from '@/lib/utils';
export default async function Page(){const s=await settings();return <section className="section prose"><h1>Your privacy</h1><p>{s.privacy_text}</p></section>;}