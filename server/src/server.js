import Fastify from 'fastify';
import cors from '@fastify/cors';
import tacoBell from './scrappers/tacoBellScrapper.js';
import mcDonalds from './scrappers/mcDonalds.js';

const fastify = Fastify({
  logger: true
})

await fastify.register(cors, { 
  origin: 'http://localhost:5173',
})


fastify.route({
  method: 'GET',
  url: '/meals',
  schema: {
    querystring: {
      type: 'object',
      properties: {
          limit: { type: 'number'}
      },
      required: ['limit'],
    },
    response: {
      200: {
        type: 'array',
        properties: {
          meals: { 
            type: 'object',
            properties: {
              name: { type: "string"},
              calories: { type: "string"}
            }
          }
        }
      }
    }
  },
  // this function is executed for every request before the handler is executed
  preHandler: async (request, reply) => {
    // E.g. check authentication
  },
  handler: async (request, reply) => {
    const { limit } = request.query

    return mcDonalds(limit);
  }
})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}