import tacoBell from './scrappers/tacoBellScrapper.js';
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
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
    // the response needs to be an object with an `hello` property of type 'string'
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
    console.log({limit})
    return tacoBell(limit);
  }
})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}