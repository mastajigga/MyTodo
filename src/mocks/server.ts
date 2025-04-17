import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

server.events.on('request:start', ({ request, requestId }) => {
  console.log('MSW intercepted:', request.method, request.url);
});

server.events.on('request:match', ({ request, requestId }) => {
  console.log('MSW matched:', request.method, request.url);
});

server.events.on('request:unhandled', ({ request, requestId }) => {
  console.log('MSW unhandled:', request.method, request.url);
});

export { handlers }; 