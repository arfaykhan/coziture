import {adminEndpoint} from '@/lib/admin';
export const POST=adminEndpoint('payments');

import {query} from '@/lib/db';
import {endpoint} from '@/lib/http';
export const GET=endpoint(async()=>query('SELECT id,code,name,instructions FROM store_payments WHERE active ORDER BY id'));
