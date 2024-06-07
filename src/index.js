import tacoBell from './scrappers/tacoBellScrapper.js';
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
  // const { limit } = request.query

  // if (+limit > 0) {
    return tacoBell(1000);
  // } else {
  //   return new Error("No calorie limit was found.")
  // }
  // return tacoBell();
})

// fastify.route({
//   method: 'GET',
//   url: '/',
//   schema: {
    // request needs to have a querystring with a `name` parameter
    // querystring: {
    //   type: 'object',
    //   properties: {
    //       limit: { type: 'number'}
    //   },
    //   required: ['limit'],
    // },
    // the response needs to be an object with an `hello` property of type 'string'
    // response: {
    //   200: {
    //     type: 'object',
    //     properties: {
    //       meal: { type: 'string' }
    //     }
    //   }
    // }
  // },
  // this function is executed for every request before the handler is executed
  // preHandler: async (request, reply) => {
    // E.g. check authentication
//   },
//   handler: async (request, reply) => {
//     // const { limit } = request.query

//     return tacoBell(1000);
//   }
// })

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}