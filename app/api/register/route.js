import bcrypt from 'bcryptjs';
import {query} from '@/lib/db';
import {register} from '@/lib/validation';
import {endpoint,body} from '@/lib/http';
import {rateLimit} from '@/lib/auth';
export const POST=endpoint(async request=>{
  const data=register.parse(await body(request));
  await rateLimit(`register:${data.email}`,5);
  await query('INSERT INTO users(name,email,password) VALUES ($1,$2,$3)',[data.name,data.email,await bcrypt.hash(data.password,12)]);
  return {ok:true};
});
