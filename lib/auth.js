import CredentialsProvider from 'next-auth/providers/credentials';
import {getServerSession} from 'next-auth';
import bcrypt from 'bcryptjs';
import {query} from './db.js';
import {createHash} from 'node:crypto';
export async function rateLimit(key, limit=8) {
  const hash = createHash('sha256').update(key).digest('hex');
  const [row] = await query(`INSERT INTO auth_attempts(key, attempts, expires_at) VALUES ($1,1,NOW()+INTERVAL '5 minutes') ON CONFLICT(key) DO UPDATE SET attempts=CASE WHEN auth_attempts.expires_at<NOW() THEN 1 ELSE auth_attempts.attempts+1 END, expires_at=CASE WHEN auth_attempts.expires_at<NOW() THEN NOW()+INTERVAL '5 minutes' ELSE auth_attempts.expires_at END RETURNING attempts`,[hash]);
  if (row.attempts>limit) throw Object.assign(new Error('Too many attempts. Try again in five minutes.'),{status:429});
}
export const authOptions = {
  secret:process.env.NEXTAUTH_SECRET,
  session:{strategy:'jwt',maxAge:86400}, pages:{signIn:'/login'},
  providers:[CredentialsProvider({name:'Email and password',credentials:{email:{type:'email'},password:{type:'password'}},async authorize(credentials) {
    const email = String(credentials?.email||'').trim().toLowerCase();
    const password = String(credentials?.password||'');
    if (!email || email.length>190 || Buffer.byteLength(password)>72) return null;
    await rateLimit(`login:${email}`);
    const [user] = await query('SELECT * FROM users WHERE email=$1',[email]);
    if (!user || !await bcrypt.compare(password,user.password.replace(/^\$2y\$/, '$2b$'))) return null;
    return {id:String(user.id),name:user.name,email:user.email};
  }})],
  callbacks:{async jwt({token,user}) {if(user) token.id=user.id; return token;},async session({session,token}) {session.user.id=token.id;return session;}}
};
export async function currentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;
  return (await query('SELECT id,name,email,role FROM users WHERE id=$1',[session.user.id]))[0] || null;
}
export async function requireUser(admin=false) {
  const user = await currentUser();
  if (!user) throw Object.assign(new Error('Please sign in.'),{status:401});
  if (admin && user.role!=='admin') throw Object.assign(new Error('Administrator access required.'),{status:403});
  return user;
}
