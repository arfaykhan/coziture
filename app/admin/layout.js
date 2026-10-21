import {redirect} from 'next/navigation';
import {currentUser} from '@/lib/auth';
import AdminSidebar from '@/components/AdminSidebar';
export default async function Layout({children}){const user=await currentUser();if(!user)redirect('/login');if(user.role!=='admin')redirect('/account');return <section className="section"><p className="eyebrow">COZITURE / STORE MANAGEMENT</p><AdminSidebar/>{children}</section>;}
