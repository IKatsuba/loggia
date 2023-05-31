import { rest } from 'msw';

export const handlers = [
  rest.post('/api/logs', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
      })
    );
  }),
  rest.get('/api/test', async (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        status: 'success',
      })
    );
  }),
];
