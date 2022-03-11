import { rest } from 'msw'

const app = [
  rest.get('/people', (req, res, ctx) => {
    // Persist user's authentication in the session
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 1,
          name: 'John Doe',
          email: ''
        }
      ])
    )
  }),
  rest.post('/people', (req, res, ctx) => {
    // Persist user's authentication in the session

    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 2,
          name: 'new people',
          email: ''
        }
      ])
    )
  }),
  rest.get('/api/people-x', (req, res, ctx) => {
    // Persist user's authentication in the session
    // 去掉 -x 可以观察 是代理 和 mock的优先级
    return res(
      ctx.status(200),
      ctx.json([
        {
          id: 2,
          name: 'new people from api',
          email: ''
        }
      ])
    )
  })
]

export default app
