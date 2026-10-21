import {adminEndpoint} from '@/lib/admin';
export const POST=adminEndpoint('settings');

import {settings} from '@/lib/catalog';
import {endpoint} from '@/lib/http';
export const GET=endpoint(async()=>settings());
