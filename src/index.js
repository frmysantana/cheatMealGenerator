import tacoBell from './scrappers/tacoBellScrapper.js';
import Fastify from 'fastify';

const fastify = Fastify({
  logger: true
})

// Declare a route
fastify.get('/', async function handler (request, reply) {
  const { limit } = request.query

  if (+limit > 0) {
    return tacoBell(limit);
  } else {
    return new Error("No calorie limit was found.")
  }
  // return tacoBell();
})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}