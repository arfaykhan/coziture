import {adminEndpoint} from '@/lib/admin';
export const POST=adminEndpoint('categories');
export const DELETE=adminEndpoint('categories');

import {catalog} from '@/lib/catalog';
import {endpoint} from '@/lib/http';
export const GET=endpoint(async()=>(await catalog()).categories);
