import fastify from 'fastify';

const server = fastify();
server.register(require('@fastify/websocket'));

server.register(require('@fastify/cors'), {
  // put your options here
});

let connection: any = {};

/*
 Basic idea is that we'lll have multiple connections to the server, hence
 giving each connection an ID and saving it in the object

 The IDs currently are numbers which can be proper public address of the users
 that connect so that we know which address we want to send targeted notifications to
 */
server.register(async function (server) {
  // @ts-ignore
  server.get('/ws', { websocket: true }, (conn, req) => {
    // @ts-ignore
    const address = req.query.address;
    connection[address] = conn;
    console.log(address, 'connected to WS server');
    // Remove the connection reference if it closes
    conn.socket.on('close', () => {
      delete connection[address];
    });
  });
});

/*
 We post a message that we want to be broadcasted to every user
 to this route. Example would be an event announcement
 */
server.post('/broadcast', async (req, res) => {
  console.log('Broadcasting');
  // @ts-ignore
  const { title, body } = req.body;
  Object.values(connection).forEach((conn) => {
    // @ts-ignore
    conn.socket.send(JSON.stringify({ title, body }));
  });
  return 'Broadcasted';
});

/*
 Notifications that we want to send to a specific targetted user. 
`For example, a user who hasn't been active for some time
 */
server.post('/send/:id', async (req, res) => {
  // @ts-ignore
  const { id } = req.params;
  console.log('Sending to ', id);
  // @ts-ignore
  const { title, body } = req.body;
  const reqdConn = connection[id];
  if (reqdConn) {
    reqdConn.socket.send(JSON.stringify({ title, body }));
    return `Sent to Connection:${id}`;
  }
  return `Unable to send to Connection:${id}`;
});

server.get('/', async (request, reply) => {
  return 'Hello from Point Push Notifications server';
});

server.get('/connected-users', async (req, reply) => {
  return Object.keys(connection).length;
});

server.listen(8080, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
