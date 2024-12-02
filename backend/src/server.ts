import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import jwt from 'jsonwebtoken';
import { AuthChecker, buildSchema } from 'type-graphql';
import { JWT_SECRET } from './constants/constants.js';
import { BookingResolver } from './resolvers/booking-resolver.js';
import { EventResolver } from './resolvers/event-resolver.js';
import { UserResolver } from './resolvers/user-resolver.js';
import { VenueResolver } from './resolvers/venue-resolver.js';
import { AppContext, UserContext } from './types/types.js';

import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { mergeSchemas } from '@graphql-tools/schema';
import { useServer } from 'graphql-ws/lib/use/ws';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import { ArtistResolver } from './resolvers/artist-resolver.js';
import { subScriptionSchema } from './subScriptionSchema.js';

const PORT = 3001;
const app = express();

const httpServer = createServer(app);

const authChecker: AuthChecker<AppContext> = ({ context }, roles) => {
  return (
    context?.userContext?.id &&
    (roles.length === 0 || roles.includes(context.userContext.role))
  );
};

const typeGraphQLSchema = await buildSchema({
  resolvers: [
    EventResolver,
    VenueResolver,
    UserResolver,
    BookingResolver,
    ArtistResolver,
  ],
  emitSchemaFile: true,
  authChecker,
});

const schema = mergeSchemas({
  schemas: [typeGraphQLSchema, subScriptionSchema],
});

const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

const serverCleanup = useServer(
  {
    schema,
    onConnect: (context) => {
      const authorization = context.connectionParams.Authorization || '';
      try {
        const userContext = jwt.verify(authorization, JWT_SECRET);
        return { userContext };
      } catch {
        throw new Error('Not authenticated');
      }
    },
  },
  wsServer
);

const server = new ApolloServer({
  schema,
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },
  ],
});

await server.start();

const options = {
  context: async ({ req }): Promise<AppContext> => {
    const token = req.headers.authorization || '';
    try {
      const userContext: UserContext = jwt.verify(token, JWT_SECRET);
      return { userContext };
    } catch {
      return { userContext: null };
    }
  },
};

app.use(
  '/graphql',
  cors<cors.CorsRequest>(),
  express.json(),
  expressMiddleware(server, options)
);

httpServer.listen({ port: PORT }, () => {
  console.log(`Server ready at http://localhost:${PORT}/graphql`);
});
