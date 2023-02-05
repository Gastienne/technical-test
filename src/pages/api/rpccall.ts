import type { NextApiRequest, NextApiResponse } from 'next';
import { EventEmitter } from 'events';
import amqp from 'amqplib';
import { v4 } from 'uuid';

type Data = {
  result: string;
};

const EXCHANGE_NAME = 'input.rpc';
const EXCHANGE_TYPE = 'direct';
const BINDING_KEY = 'lea';
const REPLY_QUEUE = 'amq.rabbitmq.reply-to';

const channelEmitter = new EventEmitter();
channelEmitter.setMaxListeners(0);

const createClient = async (rabbitmqUrl: string) => {
  const connection = await amqp.connect(rabbitmqUrl);
  const channel = await connection.createChannel();

  channel.consume(REPLY_QUEUE, (msg) => {
    channelEmitter.emit(msg?.properties.correlationId, msg?.content.toString());
  }, { noAck: true });

  return channel;
}

/**
 * Process a payload
 *
 * @todo:
 * - send the payload into rabbitmq, through `input.rpc` exchange
 * - make sure to send it with a binding key of `<your-name>`
 * - configure your publisher to wait for a response from the consumer
 * - all that flow shoudl be handled with a async process
 *
 * @param payload
 * @returns
 */
const processPayload = async (payload: string): Promise<string> => {
  const channel = await createClient(process.env.RABBITMQ_URL);

  return new Promise(async (resolve) => {
    const correlationId = v4();

    channelEmitter.once(correlationId, (payload) => {
      channel.close();
      channel.connection.close();
      resolve(payload);
    });

    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: false });

    channel.publish(EXCHANGE_NAME, BINDING_KEY, Buffer.from(payload), {
      correlationId,
      replyTo: REPLY_QUEUE
    });
  });
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const { payload } = req.body;

  const result = await processPayload('This is a string');

  res.status(200).json({ result });
}
