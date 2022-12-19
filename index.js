import { resolvers } from "./resolvers/resolvers.js";
import { typeDefs } from "./typeDefs/typeDefs.js";
import { ApolloServer } from "apollo-server-express";
import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";
import express from "express";
import cors from "cors";

(async () => {
  const schema = makeExecutableSchema({
    cors: {
      origin: "*",
      credentials: true,
    },
    typeDefs,
    resolvers,
  });

  const app = express();
  app.use(cors());

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    cache: "bounded",
    playground: true,
    introspection: true,
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
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 5002;

  httpServer.listen(PORT, () => {
    console.log(
      `Server ready at https://nextjs-backend-production.up.railway.app${server.graphqlPath}`
    );
    console.log("Port - ", PORT);
  });
})();
