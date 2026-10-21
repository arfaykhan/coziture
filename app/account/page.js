import Link from 'next/link';
import {redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {query} from '@/lib/db';
import {money} from '@/lib/utils';
export default async function Page(){const user=await currentUser();if(!user)redirect('/login');const orders=await query('SELECT id,total_cents,currency,status,created_at FROM shop_orders WHERE user_id=$1 ORDER BY id DESC',[user.id]);return <section className="section"><p className="eyebrow">YOUR LITTLE CORNER</p><h1>Hello, {user.name}.</h1><p>{user.email}</p>{user.role==='admin'&&<Link className="button" href="/admin">Manage store →</Link>}<h2 className="mt-10">Your orders</h2>{!orders.length?<p>No orders yet. <Link href="/shop">Find something you love →</Link></p>:<div className="table-wrap"><table><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td><Link href={`/order/${o.id}`}>#{o.id} →</Link></td><td>{new Date(o.created_at).toLocaleDateString('en-US')}</td><td>{o.status}</td><td>{money(o.total_cents,o.currency)}</td></tr>)}</tbody></table></div>}</section>;}
