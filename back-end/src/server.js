import Fastify from 'fastify';
import cors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import path from 'path';
import meals from './meals.js';

import { restaurantOptions } from '../../utils/constants.js';

const distDir = path.join(process.cwd(), '../front-end/dist');

const fastify = Fastify({
  logger: true
})

await fastify.register(cors, { 
  origin: [
    'http://127.0.0.1:3000',
    'http://localhost:5173', // development front-end
    'http://localhost:4173', // preview front-end
    `${process.env.HOST}:${process.env.PORT}`
  ]
})

await fastify.register(fastifyStatic, {
  root: distDir,
})


fastify.route({
  method: 'GET',
  url: '/meals',
  schema: {
    querystring: {
      type: 'object',
      properties: {
          limit: { type: 'number'},
          restaurant: { type: 'string', enum: Object.values(restaurantOptions).map(opt => opt.value)}
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
      case restaurantOptions.TACOBELL.value:
        return meals(restaurant, limit);
      case restaurantOptions.MCDONALDS.value:
        return meals(restaurant, limit);
      case restaurantOptions.WENDYS.value:
        return meals(restaurant, limit);
      case restaurantOptions.BURGER_KING.value:
        return meals(restaurant, limit);
      case restaurantOptions.POPEYES.value:
        return meals(restaurant, limit);
      default:
        return reply.status(400).send({  errorMessage: `Invalid restaurant (or not supported): ${restaurant}` })
    }
  }
})

// Run the server!
try {
  await fastify.listen({
    port: process.env.PORT || 3000,
    host: process.env.RENDER ? '0.0.0.0' : '127.0.0.1'
  })
} catch (err) {
  fastify.log.error(err)
  process.exit(1)
}
