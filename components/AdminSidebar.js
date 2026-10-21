import Link from 'next/link';
export const sections=['products','categories','orders','payments','customers','settings'];
export default function AdminSidebar(){return <nav className="admin-nav" aria-label="Store administration"><Link href="/admin">Dashboard</Link>{sections.map(s=><Link key={s} href={`/admin/${s}`}>{s[0].toUpperCase()+s.slice(1)}</Link>)}</nav>;}
