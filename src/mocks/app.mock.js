import { rest } from 'msw'

const app = [
  rest.post('/people', (req, res, ctx) => {
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
  })
]

export default app
