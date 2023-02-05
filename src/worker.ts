// @ts-ignore
import amqp, { Message } from 'amqplib';

const EXCHANGE_NAME = 'input.rpc';
const EXCHANGE_TYPE = 'direct';
const QUEUE_NAME = 'my.queue.lea';
const BINDING_KEY = 'lea';

new Promise(async (r) => {
  console.log('Worker running...');
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: false })
  const q = await channel.assertQueue(QUEUE_NAME, { exclusive: true });

  channel.bindQueue(q.queue, EXCHANGE_NAME, BINDING_KEY);

  channel.consume(q.queue, (msg) => {
    const payload = msg?.content.toString();

    if (payload) {
      channel.sendToQueue(
        msg?.properties.replyTo, 
        Buffer.from(payload.toUpperCase()),
        {
          correlationId: msg?.properties.correlationId
        }
      )
    }

    channel.ack(msg as Message);
  });

})
  .then(console.dir)
  .catch(console.error);
