import Fastify from 'fastify';
import cors from '@fastify/cors';
import tacoBell from './scrappers/tacoBellScrapper.js';
import mcDonalds from './scrappers/mcDonalds.js';
import wendys from './scrappers/wendys.js';

import { restaurantOptions } from '../../utils/constants.js';

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
          limit: { type: 'number'},
          restaurant: { type: 'string', enum: Object.values(restaurantOptions) }
      },
      required: ['limit', 'restaurant'],
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
    const { limit, restaurant } = request.query

    switch (restaurant) {
      case restaurantOptions.TACOBELL:
        return tacoBell(limit);
      case restaurantOptions.MCDONALDS:
        return mcDonalds(limit);
      case restaurantOptions.WENDYS:
        return wendys(limit);
      default:
        throw Error(`Invalid restaurant (or not supported) ${restaurant}`)
    }
  }
})

// Run the server!
try {
  await fastify.listen({ port: 3000 })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}