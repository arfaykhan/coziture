import {redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import {query} from '@/lib/db';
import Checkout from '@/components/Checkout';
export default async function Page(){const user=await currentUser();if(!user)redirect('/login');const payments=await query('SELECT * FROM store_payments WHERE active ORDER BY id');return <section className="section"><h1>Make it yours.</h1><Checkout user={user} payments={payments}/></section>;}
