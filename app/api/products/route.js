import {adminEndpoint} from '@/lib/admin';
export const POST=adminEndpoint('products');
export const DELETE=adminEndpoint('products');

import {catalog} from '@/lib/catalog';
import {endpoint} from '@/lib/http';
export const GET=endpoint(async()=>(await catalog()).products);
