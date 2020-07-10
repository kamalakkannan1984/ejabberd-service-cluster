/**
 * @createdBy Kamal
 * @createdOn 05th Mar 2020
 */

export const config = {
  server: {
    // 82.113.74.56 : urchat.unifiedring.co.uk
    host: process.env.HOST ? process.env.HOST : 'localhost',
    port: process.env.PORT ? process.env.PORT : 5001,
  },
  logger_level: process.env.LOGGER_LEVEL,
  jwt_secret: process.env.JWT_SECRET ? process.env.JWT_SECRET : 'sscret',
  basic_uname: process.env.BASIC_UNAME ? process.env.BASIC_UNAME : 'admin',
  basic_pw: process.env.BASIC_PW ? process.env.BASIC_PW : 'Ej@bberD',
  apiRoutePrefix: '/api',
  ejabberdHost: 'urchat.unifiedring.co.uk',
  ejabberdPort: '5443',
  ejabberdApiPrefix: 'api',
  FCMkey:
    'AAAAACKNddw:APA91bHCuk0JA_UynqJ_Oda2FoUayccFguMxbFrkQ8UbE80zoUBBdK-f-XG-6kBNn6EMY-ti3LOKjvqndwJiKTlNNCKP7HCoS5YWo47xQPEQTa1eMB7aDa6yvWrbpUmpsbxUePNIE7iQ',
  cors_options: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: false,
    exposedHeaders: null,
    allowedHeaders: null,
    maxAge: null,
    preflight: true,
    hideOptionsRoute: true,
  },
  swagger_options: {
    exposeRoute: true,
    routePrefix: '/api/documentation',
    swagger: {
      host: `${process.env.HOST ? process.env.HOST : 'urchat.unifiedring.co.uk'}:${
        process.env.PORT ? process.env.PORT : 5001
      }`,
      info: {
        title: 'Ejabberd Rest API Service',
        description: 'Ejabberd Rest api swagger documentation',
        version: process.env.VERSION,
      },
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        {
          name: 'health',
          description: 'Testing related end-points',
        },
        {
          name: 'user',
          description: 'User related end-points',
        },
        {
          name: 'team',
          description: 'Team related end-points',
        },
        {
          name: 'message',
          description: 'Message related end-points',
        },
        {
          name: 'event',
          description: 'Event related end-points',
        },
        {
          name: 'tasks',
          description: 'Tasks related end-points',
        },
        {
          name: 'note',
          description: 'Note related end-points',
        },
      ],
    },
  },
};
