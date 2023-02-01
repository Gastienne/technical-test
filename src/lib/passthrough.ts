import { ServerResponse } from 'http';
import { PassThrough } from 'stream';

const fs = require('fs');

export default function passthrough(filepath: string, res: ServerResponse): ServerResponse {
  // @todo:
  // 1. implement this function, use `PassThrough` stream to pipe the file content to the response explain what `PassThrough` stream is and why it is used here, could you tell another way to do this?
  // 2. add headers:
  //   - Cache-Control: max-age=3600, public
  //   - X-Metadata: technical-test
  // to see result, check `http://localhost:3000/api/storages/working.json`

  /**
   * PassThrough stream is a trivial implementation of a Transform stream that simply passes the input bytes across to the output.
   * This is mainly for testing and some other trivial use cases. Here we need to read the file content using the readable stream and pass the result
   * to the response through the PassThrough stream.
   */

  /**
   * Another way to do this
   * 
   * let rawdata = fs.readFileSync(filepath);
   * return res.end(rawdata);
   */

  const passthrough = new PassThrough();

  res.setHeader('Cache-Control', 'max-age=3600, public');
  res.setHeader('X-Metadata', 'technical-test');

  const readableStream = fs.createReadStream(filepath);

  passthrough.pipe(readableStream).pipe(res);

  return res;
}
