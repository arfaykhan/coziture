'use client';
import Link from 'next/link';
import {useSession,signOut} from 'next-auth/react';
import {useStore} from './StoreProvider';
export default function Header({settings}) {const {cart}=useStore();const {data}=useSession();return <><div className="announcement">{settings.announcement}</div><header><Link className="brand" href="/">{settings.brand}<span>✳</span></Link><nav aria-label="Main navigation"><Link href="/shop">Shop</Link><Link href="/about">Our story</Link><Link href="/contact">Contact</Link></nav><nav aria-label="Your account"><Link href="/saved">Saved ♡</Link><Link href={data?'/account':'/login'}>{data?'Account':'Sign in'}</Link><Link href="/cart">Bag ({cart.reduce((n,i)=>n+i.quantity,0)})</Link>{data&&<button className="text-button" onClick={()=>signOut({callbackUrl:'/'})}>Sign out</button>}</nav></header></>;}
