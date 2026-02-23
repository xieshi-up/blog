import type { PagesFunction } from '@cloudflare/workers-types';

export const onRequest: PagesFunction = async (context) => {
  const { default: worker } = await import('../.open-next/worker');
  return worker.fetch(context.request, context.env, context);
};