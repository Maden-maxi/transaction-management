import * as http from 'http';
import Koa from 'koa';
import cors from '@koa/cors';
import respond from 'koa-respond';
import bodyParser from 'koa-body';
import compress from 'koa-compress';

import transactions from '../routes/transactions-api';

import { logger } from './logger';
import { notFoundHandler } from '../middleware/not-found';
import { errorHandler } from '../middleware/error-handler';



/**
 * Creates and returns a new Koa application.
 * Does *NOT* call `listen`!
 *
 * @return {Promise<http.Server>} The configured app.
 */
export async function createServer() {
  logger.debug('Creating server...')
  const app = new Koa()
  // Container is configured with our services and whatnot.
  // const container = (app.container = configureContainer())
  app
    // Top middleware is the error handler.
    .use(errorHandler)
    // Compress all responses.
    .use(compress())
    // Adds ctx.ok(), ctx.notFound(), etc..
    .use(respond())
    // Handles CORS.
    .use(cors())
    // Parses request bodies.
    .use(bodyParser({
      multipart: true,
      parsedMethods: ['POST', 'PUT', 'PATCH', 'DELETE']
    }))
    // Transaction route
    .use(transactions.routes())
    .use(notFoundHandler)

  // Creates a http server ready to listen.
  const server = http.createServer(app.callback())

  // Add a `close` event listener so we can clean up resources.
  server.on('close', () => {
    // You should tear down database connections, TCP connections, etc
    // here to make sure Jest's watch-mode some process management
    // tool does not release resources.
    logger.debug('Server closing, bye!')
  })

  logger.debug('Server created, ready to listen', { scope: 'startup' })
  return server
}
