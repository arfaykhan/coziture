import {requireUser} from '@/lib/auth';
import {query} from '@/lib/db';
export default async function Page(){await requireUser(true);const [stats]=await query('SELECT (SELECT COUNT(*) FROM products) AS products,(SELECT COUNT(*) FROM shop_orders) AS orders,(SELECT COUNT(*) FROM users) AS customers');return <><h1>Store overview</h1><div className="stats">{Object.entries(stats).map(([name,count])=><div className="panel" key={name}><p>{name}</p><strong>{count}</strong></div>)}</div></>;}
