import { handle } from 'hono/cloudflare-pages';
import app from '../.open-next/worker';

export const onRequest = handle(app);