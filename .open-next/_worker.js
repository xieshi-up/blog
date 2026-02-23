import worker from './worker.js';

export default {
  async fetch(request, env, ctx) {
    console.log('Request received:', request.url);
    return worker.fetch(request, env, ctx);
  },
};