import { http, HttpResponse } from 'msw';

export const handlers = [
  http.post('/api/logs', async () => {
    return HttpResponse.json({
      status: 'success',
    });
  }),
  http.get('/api/test', async () => {
    return HttpResponse.json({
      status: 'success',
    });
  }),
];
