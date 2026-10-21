import pg from 'pg';
let pool;
export function database() {
  if (!process.env.DATABASE_URL) throw Object.assign(new Error('Store database is not configured.'), {status:503});
  return pool ||= new pg.Pool({connectionString:process.env.DATABASE_URL, max:3, idleTimeoutMillis:10000, connectionTimeoutMillis:10000});
}
export async function query(text, values = []) { return (await database().query(text, values)).rows; }
export async function transaction(work) {
  const client = await database().connect();
  const q = async (text, values = []) => (await client.query(text, values)).rows;
  try { await q('BEGIN'); const result = await work(q); await q('COMMIT'); return result; }
  catch(error) { await q('ROLLBACK'); throw error; }
  finally { client.release(); }
}
