import fastify from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import fastify_mongodb from 'fastify-mongodb';
import Ajv from 'ajv';
import { config } from './config/app';
import { utils } from './utils/utils';
import { authHandler } from './handlers/auth.hanlder';
import { configureRoutes } from './routes';
import fs from 'fs';
require('ssl-root-cas').inject();
const server: fastify.FastifyInstance<Server, IncomingMessage, ServerResponse> = fastify({
  logger: true,
  trustProxy: true,
  https: {
    key: fs.readFileSync('/etc/pki/tls/certs/star.urchat.unifiedring.co.uk.key', 'utf8'),
    cert: fs.readFileSync('/etc/pki/tls/certs/star.urchat.unifiedring.co.uk.crt', 'utf8'),
  },
  serverFactory: require('fastify-http2https')(),
});

server.register(require('fastify-swagger'), config.swagger_options);
server.register(require('fastify-cors'), config.cors_options);

// mongoDb connection
// mongodb://smepbx:smeswitch@10.22.7.228:27017/Unifiedring
server.register(fastify_mongodb, {
  url: 'mongodb://smepbx:smeswitch@10.22.7.228:27017/Unifiedring',
  name: 'MONGO1',
});

// add hooks with relevant handlers
server.addHook('preHandler', utils.formReqData);
server.addHook('onResponse', utils.formResData);
server.addHook('onError', utils.handleError);

// decorate functions
server
  .decorate('validateSession', authHandler.validateSession)
  .register(require('fastify-auth'))
  .register(configureRoutes)
  .after(() => {
    // routes.registerRoutes(fastify);
  });

const ajv = new Ajv({
  // the fastify defaults (if needed)
  removeAdditional: true,
  useDefaults: true,
  coerceTypes: true,
  allErrors: true,
  nullable: true,
});

// set fastify default schema compiler
server.setSchemaCompiler((schema) => {
  return ajv.compile(schema);
});

// handle unhandled exception
process.on('uncaughtException', (err) => {
  server.log.error(err);
});

// Run the server!
const start = async () => {
  try {
    const host: any = config.server;
    server.listen(host);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
