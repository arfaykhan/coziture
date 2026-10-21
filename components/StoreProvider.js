'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {SessionProvider} from 'next-auth/react';
const StoreContext=createContext(null);
export const useStore=()=>useContext(StoreContext);
export function StoreProvider({children}) {
  const [cart,setCart]=useState([]),[saved,setSaved]=useState([]),[ready,setReady]=useState(false),[notice,setNotice]=useState('');
  useEffect(()=>{try{const c=JSON.parse(localStorage.getItem('coziture-cart')||'[]'),s=JSON.parse(localStorage.getItem('coziture-saved')||'[]');if(Array.isArray(c))setCart(c.filter(i=>Number.isInteger(i.id)&&i.id>0&&Number.isInteger(i.quantity)&&i.quantity>0&&i.quantity<=99));if(Array.isArray(s))setSaved(s.filter(Number.isInteger));}catch{}setReady(true);},[]);
  useEffect(()=>{if(ready)try{localStorage.setItem('coziture-cart',JSON.stringify(cart));localStorage.setItem('coziture-saved',JSON.stringify(saved));}catch{}},[cart,saved,ready]);
  useEffect(()=>{if(!notice)return;const timer=setTimeout(()=>setNotice(''),4000);return()=>clearTimeout(timer);},[notice]);
  function add(product,quantity=1) {const current=cart.find(i=>i.id===product.id)?.quantity||0;if(current+quantity>Math.min(product.stock,99)){setNotice('That quantity is unavailable.');return;}setCart([...cart.filter(i=>i.id!==product.id),{id:product.id,quantity:current+quantity}]);setNotice(`${product.name} added to your bag.`);}
  function save(id) {setSaved(saved.includes(id)?saved.filter(v=>v!==id):[...saved,id]);}
  return <SessionProvider><StoreContext.Provider value={{cart,setCart,saved,save,add,ready}}>{children}{notice&&<div className="toast" role="status">{notice}</div>}</StoreContext.Provider></SessionProvider>;
}
