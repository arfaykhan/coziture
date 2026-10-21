import {adminEndpoint} from '@/lib/admin';
export const POST=adminEndpoint('customers');

import {query} from '@/lib/db';
import {requireUser} from '@/lib/auth';
import {endpoint} from '@/lib/http';
export const GET=endpoint(async()=>{await requireUser(true);return query('SELECT id,name,email,role FROM users ORDER BY id DESC');});
