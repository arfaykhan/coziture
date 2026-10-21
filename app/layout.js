import './globals.css';
import {settings} from '@/lib/catalog';
import {StoreProvider} from '@/components/StoreProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
export const dynamic='force-dynamic';
export const metadata={title:{default:'Coziture — Thoughtful finds',template:'%s | Coziture'},description:'Beautiful pieces. Comfortable spaces. Thoughtfully chosen furniture and everyday essentials.'};
export default async function RootLayout({children}) {const s=await settings();return <html lang="en"><body><StoreProvider><Header settings={s}/>{!process.env.DATABASE_URL&&<div className="preview-note">Catalog preview · Connect your store database to enable accounts and checkout.</div>}<main>{children}</main><Footer settings={s}/></StoreProvider></body></html>;}
