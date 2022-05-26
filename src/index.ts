import fastify from 'fastify';

const server = fastify();
server.register(require('@fastify/websocket'));

server.register(async function (server) {
  // @ts-ignore
  server.get('/ws', { websocket: true }, (connection, req) => {
    let messageCount = 1;
    setInterval(() => {
      // @ts-ignore
      connection.socket.send(
        JSON.stringify({
          title: `Point Notification #${messageCount}`,
          body: `You have #${messageCount} message from WS Server`,
        })
      );
      messageCount++;
    }, 30000);
  });
});

server.get('/', async (request, reply) => {
  return 'Hello from Point Push Notifications server';
});

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
