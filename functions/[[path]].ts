export const onRequest = async (context) => {
  const { default: worker } = await import('../.open-next/worker');
  return worker.fetch(context.request, context.env, context);
};