import {ZodError} from 'zod';
export function endpoint(fn) { return async (request,context) => {
  try {
    if (!['GET','HEAD'].includes(request.method)) {
      const origin=request.headers.get('origin');
      const expected=process.env.NEXTAUTH_URL || request.url;
      if (!origin || origin!==new URL(expected).origin) return Response.json({error:'Invalid request origin.'},{status:403});
      if (!request.headers.get('content-type')?.includes('application/json')) return Response.json({error:'JSON required.'},{status:415});
    }
    return Response.json(await fn(request,context),{headers:{'Cache-Control':'no-store'}});
  } catch(error) {
    const status=error instanceof ZodError ? 400 : error.status || (['23505','23503','23514'].includes(error.code)?409:500);
    const message=error instanceof ZodError ? error.issues[0].message : status===500?'Unable to complete the request. Please try again.':status===409?'This change conflicts with existing records.':error.message;
    if(status===500) console.error('Store request failed',error.code || error.name);
    return Response.json({error:message},{status});
  }
}; }
export function reject(message,status=400) { throw Object.assign(new Error(message),{status}); }
export async function body(request) { const value=await request.text(); if(value.length>50000) reject('Request too large.',413); try{return JSON.parse(value)}catch{reject('Invalid JSON.')} }
